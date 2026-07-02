import React, { useMemo } from "react";
import { GetLocalLlmModels_ResponseDto, StartChatStream_RequestDto, StartChatStream_ResponseDto, TestLocalLlmConnection_ResponseDto } from "shared";
import { LocalLlmService } from "./Providers/Provider.native";

export interface ILLMService {
  testConnection(endpointBaseUrl: string): Promise<TestLocalLlmConnection_ResponseDto>;
  listModels(endpointBaseUrl: string): Promise<GetLocalLlmModels_ResponseDto>;
  startChatStream(request: StartChatStream_RequestDto): Promise<StartChatStream_ResponseDto>;
  stopChatStream(streamId: string): Promise<void>;
}

export interface LLMServiceProviderProps {
  children?: React.ReactNode;
}

export function LLMServiceProvider(props: LLMServiceProviderProps) {
  const { children } = props;
  const serviceRef = React.useRef<ILLMService>(new LocalLlmService());

  const contextValue = useMemo(() => ({
    testConnection: (endpointBaseUrl: string) => serviceRef.current.testConnection(endpointBaseUrl),
    listModels: (endpointBaseUrl: string) => serviceRef.current.listModels(endpointBaseUrl),
    startChatStream: (request: StartChatStream_RequestDto) => serviceRef.current.startChatStream(request),
    stopChatStream: (streamId: string) => serviceRef.current.stopChatStream(streamId),
  }), []);

  return (
    <LLMServiceContext.Provider value={contextValue}>
      {children}
    </LLMServiceContext.Provider>
  );
}

export function useLLMService(): ILLMService {
  const context = React.useContext(LLMServiceContext);
  if (!context) {
    throw new Error("useLLMService must be used within a LLMServiceProvider");
  }
  return context;
}

const LLMServiceContext = React.createContext<ILLMService | null>(null);
