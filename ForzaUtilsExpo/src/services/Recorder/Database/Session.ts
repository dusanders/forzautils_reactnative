import { ContextBridge_Session, ElectronContextBridge, ISessionInfo, ITelemetryData } from "shared";
import { ISession } from "../DatabaseInterfaces";

const apiBridge = (window as any).electronAPI as ElectronContextBridge;
export default class Session implements ISession {
  static async FromInfo(info: ISessionInfo): Promise<Session> {
    const session = new Session(info);
    await session.initialize();
    return session;
  }
  currentReadOffset: number = 0;
  info: ISessionInfo;
  private api: ContextBridge_Session;

  constructor(info: ISessionInfo) {
    if(!apiBridge || !apiBridge.SessionRequests) {
      throw new Error("Electron Context Bridge API is not available.");
    }
    this.info = info;
    this.api = apiBridge.SessionRequests;
  }
  async addPacket(packet: ITelemetryData): Promise<void> {
    await this.api.addPacket(packet);
    this.currentReadOffset++;
  }
  async readPacket(offset?: number): Promise<ITelemetryData | null> {
    const packet = await this.api.readPacket(offset);
    if (packet) {
      this.currentReadOffset++;
    }
    return packet;
  }
  close(): void {
    this.api.close();
  }
  delete(): Promise<void> {
    return this.api.delete();
  }
  private async initialize() {
    const openedInfo = await this.api.open(this.info);
    this.info = openedInfo;
  }
}