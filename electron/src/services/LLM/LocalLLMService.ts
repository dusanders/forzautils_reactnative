import { DEFAULT_MODEL, DEFAULT_MAX_TOKENS, DEFAULT_CONTEXT_SIZE, DEFAULT_ENDPOINT } from "./constants";
import { ISupportRendererService } from "../../renderer/renderer.types";
import { ChatGenerationSettings, ChatMessage, ChatStreamEvent, GetLocalLlmModels_ResponseDto, IpcActions_LocalLLM, StartChatStream_RequestDto, StartChatStream_ResponseDto, TestLocalLlmConnection_ResponseDto } from 'shared'
import { Logger } from "../Logger/Logger";

export interface LocalLlmStreamTarget {
  send(event: ChatStreamEvent): void;
}

function randomKey() {
  let
    d = new Date().getTime(),
    d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxx-xxxx-4xxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
}

export class LocalLlmService implements ISupportRendererService {
  private activeStreams = new Map<string, AbortController>();

  attachHandlers(ipcMain: Electron.IpcMain): void {
    ipcMain.handle(IpcActions_LocalLLM.TestConnection, async (event, request: { endpointBaseUrl: string }) => {
      return this.testConnection(request.endpointBaseUrl);
    });
    ipcMain.handle(IpcActions_LocalLLM.GetModels, async (event, request: { endpointBaseUrl: string }) => {
      return this.listModels(request.endpointBaseUrl);
    });
    ipcMain.handle(IpcActions_LocalLLM.StartChatStream, async (event, request: StartChatStream_RequestDto) => {
      const target: LocalLlmStreamTarget = {
        send: (payload) => event.sender.send(IpcActions_LocalLLM.StartChatStream, payload),
      };
      return this.startChatStream(request, target);
    });
    ipcMain.handle(IpcActions_LocalLLM.StopChatStream, async (event, request: { streamId: string }) => {
      this.cancelStream(request.streamId);
    });
  }

  async testConnection(endpointBaseUrl: string): Promise<TestLocalLlmConnection_ResponseDto> {
    try {
      const url = this.resolveEndpoint(endpointBaseUrl, "/chat/completions");
      const payload = {
        model: DEFAULT_MODEL,
        stream: false,
        messages: [
          { role: "system", content: "You are a connection test." },
          { role: "user", content: "Reply with OK." },
        ],
        max_tokens: 3,
        temperature: 0,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.text();
        return { ok: false, error: body || `HTTP ${response.status}` };
      }
      return { ok: true };
    } catch (error: unknown) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async listModels(endpointBaseUrl: string): Promise<GetLocalLlmModels_ResponseDto> {
    try {
      const url = this.resolveEndpoint(endpointBaseUrl, "/models");
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `HTTP ${response.status}`);
      }
      const data = await response.json() as any;
      const models = Array.isArray(data?.data)
        ? data.data.map((item: any) => String(item?.id || "")).filter(Boolean)
        : [];
      return { models };
    } catch (error: unknown) {
      Logger.warn('LocalLLMService', `Failed to list models: ${error instanceof Error ? error.message : String(error)}`);
      return { models: [] };
    }
  }

  async startChatStream(
    request: StartChatStream_RequestDto,
    target: LocalLlmStreamTarget
  ): Promise<StartChatStream_ResponseDto> {
    const streamId = randomKey();
    const controller = new AbortController();
    this.activeStreams.set(streamId, controller);

    this.streamChat(request, streamId, controller, target).catch((error) => {
      Logger.error('LocalLLMService', `LLM stream failed: ${error instanceof Error ? error.message : String(error)}`);
      target.send({
        type: "error",
        streamId,
        error: error instanceof Error ? error.message : String(error),
      });
      this.activeStreams.delete(streamId);
    });

    return { streamId };
  }

  cancelStream(streamId: string) {
    const controller = this.activeStreams.get(streamId);
    if (!controller) {
      return;
    }
    controller.abort();
    this.activeStreams.delete(streamId);
  }

  private async streamChat(
    request: StartChatStream_RequestDto,
    streamId: string,
    controller: AbortController,
    target: LocalLlmStreamTarget
  ) {
    const url = this.resolveEndpoint(request.endpointBaseUrl, "/chat/completions");
    const payload = this.buildPayload(request);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      const body = await response.text();
      target.send({
        type: "error",
        streamId,
        error: body || `HTTP ${response.status}`,
      });
      this.activeStreams.delete(streamId);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        buffer = this.processBuffer(buffer, streamId, target);
      }
      if (buffer.trim().length > 0) {
        this.processBuffer(buffer, streamId, target, true);
      }
      target.send({ type: "done", streamId });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        target.send({ type: "canceled", streamId });
      } else {
        target.send({
          type: "error",
          streamId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } finally {
      this.activeStreams.delete(streamId);
    }
  }

  private processBuffer(buffer: string, streamId: string, target: LocalLlmStreamTarget, flush = false): string {
    const lines = buffer.split(/\r?\n/);
    const remainder = flush ? "" : lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) {
        continue;
      }
      const data = trimmed.replace(/^data:\s*/, "");
      if (!data) {
        continue;
      }
      if (data === "[DONE]") {
        continue;
      }
      try {
        const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
        const content = parsed.choices?.[0]?.delta?.content;
        if (typeof content === "string") {
          target.send({ type: "chunk", streamId, content });
        }
      } catch (error: unknown) {
        Logger.warn('LocalLLMService', `Failed to parse SSE chunk: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return remainder;
  }

  private buildMessages(persona: string, messages: ChatMessage[], userMessage: string, maxTokens: number, context?: string) {
    const trimmedContext = context?.trim();
    const openingAssistant = messages[0]?.role === "assistant" ? messages[0]?.content?.trim() : "";
    const personaParts = [persona];
    if (openingAssistant) {
      personaParts.push(`Assistant opening message:\n${openingAssistant}`);
    }
    if (trimmedContext) {
      personaParts.push(`Additional context:\n${trimmedContext}`);
    }
    const personaMessage = { role: "system", content: personaParts.join("\n\n") };
    const finalUser = { role: "user", content: userMessage };
    const budgetTokens = Math.max(1, maxTokens);
    const selected: Array<{ role: string; content: string }> = [];
    let used = this.estimateTokens(personaMessage.content) + this.estimateTokens(finalUser.content);

    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (i === 0 && openingAssistant) {
        continue;
      }
      const message = messages[i];
      if (!message) {
        continue;
      }
      const tokens = this.estimateTokens(message.content);
      if (used + tokens > budgetTokens) {
        break;
      }
      selected.unshift({ role: message.role, content: message.content });
      used += tokens;
    }

    return [personaMessage, ...this.normalizeAlternatingHistory(selected), finalUser];
  }

  private normalizeAlternatingHistory(messages: Array<{ role: string; content: string }>) {
    const normalized: Array<{ role: string; content: string }> = [];

    for (const message of messages) {
      if (message.role !== "user" && message.role !== "assistant") {
        continue;
      }
      const content = message.content?.trim();
      if (!content) {
        continue;
      }
      if (normalized.length === 0 && message.role !== "user") {
        continue;
      }
      const previous = normalized[normalized.length - 1];
      if (previous?.role === message.role) {
        previous.content = `${previous.content}\n\n${content}`;
        continue;
      }
      normalized.push({ role: message.role, content });
    }

    if (normalized[normalized.length - 1]?.role === "user") {
      normalized.pop();
    }

    return normalized;
  }

  private buildPayload(request: StartChatStream_RequestDto) {
    const settings: ChatGenerationSettings = request.settings || {};
    const model = settings.model || DEFAULT_MODEL;
    const maxTokens = typeof settings.maxTokens === "number" && Number.isFinite(settings.maxTokens)
      ? settings.maxTokens
      : DEFAULT_MAX_TOKENS;
    const contextSize = typeof settings.contextSize === "number" && Number.isFinite(settings.contextSize)
      ? settings.contextSize
      : DEFAULT_CONTEXT_SIZE;
    const payload: Record<string, unknown> = {
      model,
      stream: true,
      messages: this.buildMessages(request.persona, request.messages, request.userMessage, contextSize, request.context),
    };
    this.assignNumber(payload, "temperature", settings.temperature);
    this.assignNumber(payload, "top_p", settings.topP);
    this.assignNumber(payload, "top_k", settings.topK);
    this.assignNumber(payload, "max_tokens", maxTokens);
    this.assignNumber(payload, "presence_penalty", settings.presencePenalty);
    this.assignNumber(payload, "frequency_penalty", settings.frequencyPenalty);
    this.assignNumber(payload, "repeat_penalty", settings.repeatPenalty);
    this.assignNumber(payload, "min_p", settings.minP);
    this.assignNumber(payload, "typical_p", settings.typicalP);
    if (Array.isArray(settings.stop) && settings.stop.length > 0) {
      payload.stop = settings.stop;
    }
    return payload;
  }

  private estimateTokens(content: string): number {
    if (!content) {
      return 0;
    }
    return Math.ceil(content.length / 4);
  }

  private assignNumber(payload: Record<string, unknown>, key: string, value: number | undefined) {
    if (typeof value === "number" && Number.isFinite(value)) {
      payload[key] = value;
    }
  }

  private resolveEndpoint(baseUrl: string, path: string): string {
    const trimmed = (baseUrl || DEFAULT_ENDPOINT).trim().replace(/\/+$/, "");
    const normalized = trimmed.endsWith("/v1") ? trimmed : `${trimmed}/v1`;
    return `${normalized}${path}`;
  }
}
