import { TestLocalLlmConnection_ResponseDto, GetLocalLlmModels_ResponseDto, StartChatStream_RequestDto, StartChatStream_ResponseDto } from "shared";

export class LocalLlmService {
  async testConnection(endpointBaseUrl: string): Promise<TestLocalLlmConnection_ResponseDto> {
    throw new Error("LocalLlmService is not implemented for React Native yet");
  }

  async listModels(endpointBaseUrl: string): Promise<GetLocalLlmModels_ResponseDto> {
    throw new Error("LocalLlmService is not implemented for React Native yet");
  }

  async startChatStream(request: StartChatStream_RequestDto): Promise<StartChatStream_ResponseDto> {
    throw new Error("LocalLlmService is not implemented for React Native yet");
  }

  async stopChatStream(streamId: string): Promise<void> {
    throw new Error("LocalLlmService is not implemented for React Native yet");
  }
}