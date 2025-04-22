import React, { createContext, useContext } from "react";

export interface ILogger {
  debug(tag: string, msg: string): void;
  log(tag: string, msg: string): void;
  error(tag: string, msg: string): void;
  warn(tag: string, msg: string): void;
}

const logger: ILogger = {
  debug: function (tag: string, msg: string): void {
    console.debug(`${tag} :: ${msg}`);
  },
  log: function (tag: string, msg: string): void {
    console.log(`${tag} :: ${msg}`);
  },
  error: function (tag: string, msg: string): void {
    console.error(`${tag} :: ${msg}`);
  },
  warn: function (tag: string, msg: string): void {
    console.warn(`${tag} :: ${msg}`);
  }
}
export function Logger() {
  return logger;
}
const LoggerContext = createContext(logger);
export function useLogger(): ILogger {
  return useContext(LoggerContext);
}