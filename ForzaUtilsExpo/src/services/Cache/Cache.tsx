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

  const contextValue: ICacheContext = {
    setItem: (key, value) => serviceRef.current.setItem(key, value),
    getItem: (key) => serviceRef.current.getItem(key),
    removeItem: (key) => serviceRef.current.removeItem(key),
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
