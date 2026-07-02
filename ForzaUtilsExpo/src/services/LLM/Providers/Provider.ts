import { ElectronContextBridge, GetLocalLlmModels_ResponseDto, StartChatStream_RequestDto, StartChatStream_ResponseDto, TestLocalLlmConnection_ResponseDto } from "shared";


const apiBridge = (window as any).electronAPI as ElectronContextBridge;

const TAG = "LocalLlmService_web";
export class LocalLlmService {
  async testConnection(endpointBaseUrl: string): Promise<TestLocalLlmConnection_ResponseDto> {
    return apiBridge.LocalLLMRequests.testConnection(endpointBaseUrl);
  }

  async listModels(endpointBaseUrl: string): Promise<GetLocalLlmModels_ResponseDto> {
    return apiBridge.LocalLLMRequests.listModels(endpointBaseUrl);
  }

  async startChatStream(request: StartChatStream_RequestDto): Promise<StartChatStream_ResponseDto> {
    return apiBridge.LocalLLMRequests.startChatStream(request);
  }

  async stopChatStream(streamId: string): Promise<void> {
    return apiBridge.LocalLLMRequests.stopChatStream(streamId);
  }
}