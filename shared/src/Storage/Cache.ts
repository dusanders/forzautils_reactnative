
export const IpcActions_Cache = {
  SetItem: "CacheRequest.SetItem",
  GetItem: "CacheRequest.GetItem",
  RemoveItem: "CacheRequest.RemoveItem",
}

export interface ContextBridge_Cache {
  setItem<T>(key: string, value: T): Promise<void>;
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
}