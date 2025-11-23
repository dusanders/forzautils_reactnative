import { ContextBridge_Database, ElectronContextBridge, ISessionInfo } from "shared";
import { IDatabaseService, ISession } from "../DatabaseInterfaces";
import Session from "./Session";

const apiBridge = (window as any).electronAPI as ElectronContextBridge;

export default class DatabaseService implements IDatabaseService {
  private api: ContextBridge_Database;
  constructor() {
    if (!apiBridge || !apiBridge.DatabaseRequests) {
      throw new Error("Electron Context Bridge API is not available.");
    }
    this.api = apiBridge.DatabaseRequests;
  }
  async getAllSessions(): Promise<ISession[]> {
    const result = await this.api.getAllSessions();
    return Promise.all(result.map(info => Session.FromInfo(info)));
  }
  async getSessionByName(name: string): Promise<ISession | null> {
    const result = await this.api.getAllSessions()
    const found = result.find(session => session.name === name);
    if (!found) return null;
    return Session.FromInfo(found);
  }
  async generateSession(): Promise<ISession> {
    const result = await this.api.generateSession();
    return Session.FromInfo(result);
  }
  close(): void {
    this.api.close();
  }
}