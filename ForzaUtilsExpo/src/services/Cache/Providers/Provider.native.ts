import { ICache } from "@/types";
import { ICacheContext } from "../Cache";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CacheService implements ICacheContext {
  async setItem<T>(key: string, value: ICache<T>): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
  getItem<T>(key: string): Promise<T | null> {
    return AsyncStorage.getItem(key).then((result) => {
      if (result) {
        return JSON.parse(result) as T;
      }
      return null;
    });
  }
  removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
}