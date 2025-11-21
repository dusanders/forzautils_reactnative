import { ICache } from "@/types";
import React from "react";
import CacheService from "./Providers/Provider";

export interface ICacheContext {
  setItem<T>(key: string, value: ICache<T>): Promise<void>;
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
}

export interface ICacheProviderProps {
  children: React.ReactNode;
}

const CacheContext = React.createContext<ICacheContext | null>(null);

export function CacheProvider(props: ICacheProviderProps) {
  const { children } = props;
  const serviceRef = React.useRef<CacheService>(new CacheService());
  const setItem = async <T,>(key: string, value: ICache<T>): Promise<void> => {
    await serviceRef.current.setItem(key, value);
  };

  const getItem = async <T,>(key: string): Promise<T | null> => {
    return await serviceRef.current.getItem(key);
  };

  const removeItem = async (key: string): Promise<void> => {
    await serviceRef.current.removeItem(key);
  };

  const contextValue: ICacheContext = {
    setItem,
    getItem,
    removeItem,
  };

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache(): ICacheContext {
  const context = React.useContext(CacheContext);
  if (!context) {
    throw new Error("useCache must be used within a CacheProvider");
  }
  return context;
}
