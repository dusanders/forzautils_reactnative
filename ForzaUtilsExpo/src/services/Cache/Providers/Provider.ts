import { ICache } from "@/types";
import { ICacheContext } from "../Cache";
import { ElectronContextBridge } from "shared";

const apiBridge = (window as any).electronAPI as ElectronContextBridge;

const TAG = "CacheService_web";
export default class CacheService implements ICacheContext {
  setItem<T>(key: string, value: ICache<T>): Promise<void> {
    return apiBridge.CacheRequests.setItem(key, value);
  }
  async getItem<T>(key: string): Promise<T | null> {
    const result = await apiBridge.CacheRequests.getItem(key);
    if (result) {
      return result as T;
    }
    return null;
  }
  removeItem(key: string): Promise<void> {
    return apiBridge.CacheRequests.removeItem(key);
  }
}
