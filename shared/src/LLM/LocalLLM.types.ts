
export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  createdAt: number;
}

export interface ChatSession {
  sessionId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  contextInput?: string;
  personaOverride?: string;
  messages: ChatMessage[];
}

export interface ChatSessionSummary {
  sessionId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

export interface ChatFileSessions {
  galleryId: string;
  fileId: string;
  sessions: ChatSession[];
}

export interface ChatConfig {
  endpointBaseUrl?: string;
  model?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  repeatPenalty?: number;
  minP?: number;
  typicalP?: number;
  contextInput?: string;
  contextSize?: number;
  stop?: string[];
}

export interface ChatGenerationSettings {
  model?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  contextSize?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  repeatPenalty?: number;
  minP?: number;
  typicalP?: number;
  stop?: string[];
}

export interface ChatHistoryDb {
  version: number;
  config: ChatConfig;
  sessionsByFile: Record<string, ChatFileSessions>;
}

export interface LoadChatConfig_ResponseDto {
  config: ChatConfig;
}

export interface SaveChatConfig_RequestDto {
  config: ChatConfig;
}

export interface ListChatSessions_RequestDto {
  galleryId: string;
  fileId: string;
}

export interface ListChatSessions_ResponseDto {
  sessions: ChatSessionSummary[];
}

export interface LoadChatSession_RequestDto {
  galleryId: string;
  fileId: string;
  sessionId: string;
}

export interface LoadChatSession_ResponseDto {
  session?: ChatSession;
}

export interface SaveChatSession_RequestDto {
  galleryId: string;
  fileId: string;
  session: ChatSession;
}

export interface DeleteChatSessions_RequestDto {
  galleryId: string;
  fileId: string;
}

export interface TestLocalLlmConnection_RequestDto {
  endpointBaseUrl: string;
}

export interface TestLocalLlmConnection_ResponseDto {
  ok: boolean;
  error?: string;
}

export interface StartChatStream_RequestDto {
  endpointBaseUrl: string;
  persona: string;
  messages: ChatMessage[];
  userMessage: string;
  context?: string;
  settings?: ChatGenerationSettings;
}

export interface StartChatStream_ResponseDto {
  streamId: string;
}

export interface GetLocalLlmModels_ResponseDto {
  models: string[];
}

export interface CancelChatStream_RequestDto {
  streamId: string;
}

export type ChatStreamEvent =
  | { type: "chunk"; streamId: string; content: string }
  | { type: "error"; streamId: string; error: string }
  | { type: "done"; streamId: string }
  | { type: "canceled"; streamId: string };


export const IpcActions_LocalLLM = {
  TestConnection: "LocalLLM.TestConnection",
  GetModels: "LocalLLM.GetModels",
  StartChatStream: "LocalLLM.StartChatStream",
  StopChatStream: "LocalLLM.StopChatStream",
};

export interface ContextBridge_LocalLLM {
  testConnection: (endpointBaseUrl: string) => Promise<TestLocalLlmConnection_ResponseDto>;
  listModels: (endpointBaseUrl: string) => Promise<GetLocalLlmModels_ResponseDto>;
  startChatStream: (request: StartChatStream_RequestDto) => Promise<StartChatStream_ResponseDto>;
  stopChatStream: (streamId: string) => Promise<void>;
}