import { ICache } from "@/types";
import { ICacheContext } from "../Cache";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CacheService implements ICacheContext {
  async setItem<T>(key: string, value: ICache<T>): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
  async getItem<T>(key: string): Promise<T | null> {
    const found = await AsyncStorage.getItem(key);
    if (found) {
      return JSON.parse(found) as T;
    }
    return null;
  }
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}