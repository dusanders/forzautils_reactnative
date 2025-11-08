import { createContext, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ICache } from "../types/types";

export interface ICacheStore {
  getItem<T extends ICache<T>>(key: string): Promise<T | null>;
  setItem<T extends ICache<T>>(key: string, value: T): Promise<T>;
}

export const CacheContext = createContext({} as ICacheStore);

export interface CacheProviderProps {
  children?: React.ReactNode;
}

export function CacheProvider(props: CacheProviderProps) {
  return (
    <CacheContext.Provider value={{
      getItem: async (key: string) => {
        const found = await AsyncStorage.getItem(key);
        return found ? JSON.parse(found) : null;
      },
      setItem: async (key: string, value: any) => {
        const serialized = JSON.stringify(value);
        await AsyncStorage.setItem(key, serialized);
        return value;
      }
    }}>
      {props.children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  return useContext(CacheContext);
}