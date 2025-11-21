import { Logger } from "../Logger/Logger.js";
import { ForzaTelemetryApi, IpcActions_UDP, IpcActions_WiFi, IWiFiInfoState } from 'shared';
import * as SysInfo from 'systeminformation';
import * as dgram from 'dgram';
import { Semaphore } from "../../helpers/Semaphore.js";
import { ISupportRendererService } from "../../renderer/renderer.types.js";

const TAG = "WiFiServiceProvider";
export class WifiServiceProvider implements ISupportRendererService {

  private udpPort: number = -1;
  private socket: dgram.Socket | null = null;
  private bindSemaphore: Semaphore = new Semaphore(1);

  constructor(private window: Electron.BrowserWindow) {
    Logger.log(TAG, "WiFiServiceProvider initialized");
  }

  attachHandlers(ipcMain: Electron.IpcMain) {
    ipcMain.handle(IpcActions_WiFi.RequestWiFiInfo, () => this.fetchWiFiInfo());
    ipcMain.handle(IpcActions_UDP.OpenUDPSocket, (event, port) => this.openUDPSocket(port));
    ipcMain.handle(IpcActions_UDP.GetPort, () => this.getPort());
    ipcMain.handle(IpcActions_UDP.CloseUDPSocket, () => this.closeUDPSocket());
  }

  private async openUDPSocket(port: number): Promise<number> {
    await this.bindSemaphore.acquire();
    try {
      const openedPort = await this.bind(port);
      return openedPort;
    } catch (error) {
      Logger.error(TAG, `Error opening UDP socket on port ${port}: ${(error as Error).message}`);
      throw error;
    } finally {
      this.bindSemaphore.release();
    }
  }

  private async getPort(): Promise<number> {
    return this.udpPort;
  }

  private async closeUDPSocket(): Promise<void> {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.udpPort = -1;
      Logger.log(TAG, `UDP Socket closed`);
    }
  }

  private onSocketData(packet: Buffer<ArrayBuffer>, rinfo: dgram.RemoteInfo) {
    Logger.log(TAG, `Received UDP packet of length ${packet.length} from ${rinfo.address}:${rinfo.port}`);
    const forzaData = ForzaTelemetryApi.parseData(rinfo.size, packet);
    this.window.webContents.send(IpcActions_UDP.SocketData, forzaData);
    // Process packet as needed
  }

  private onSocketError(error: Error) {
    Logger.error(TAG, `UDP Socket error: ${error.message}`);
    this.socket?.close();
    this.socket = null;
    this.udpPort = -1;
    this.window.webContents.send(IpcActions_UDP.SocketError, error);
  }

  private onSocketClosed() {
    Logger.log(TAG, `UDP Socket closed`);
    this.udpPort = -1;
    this.socket = null;
    this.window.webContents.send(IpcActions_UDP.SocketClosed);
  }

  private async bind(port: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (this.socket) {
        Logger.log(TAG, `UDP Socket already open on port ${this.udpPort}`);
        resolve(this.udpPort);
        return;
      }
      Logger.log(TAG, `Opening UDP Socket on port ${port}`);
      try {
        this.socket = dgram.createSocket('udp4');
        this.socket.once('error', (err) => {
          Logger.error(TAG, `UDP Socket error: ${err.message}`);
          this.socket?.close();
          this.socket = null;
          this.udpPort = -1;
          reject(err);
        });
        this.socket.once('listening', () => {
          this.udpPort = this.socket?.address().port ?? -1;
          this.socket?.removeAllListeners('error');
          this.socket?.removeAllListeners('listening');
          this.socket?.on('error', this.onSocketError.bind(this));
          this.socket?.on('close', this.onSocketClosed.bind(this));
          this.socket?.on('message', this.onSocketData.bind(this));
          Logger.log(TAG, `UDP Socket listening on port ${this.udpPort}`);
          resolve(this.udpPort);
        });
        this.socket.bind(port);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async fetchWiFiInfo() {
    const wifiInfo: IWiFiInfoState = {
      ssid: "",
      ipAddress: "",
      isConnected: false,
    };
    let wifiInterface: SysInfo.Systeminformation.WifiConnectionData | undefined = undefined;
    const sysWifiInfo = await SysInfo.wifiConnections();
    if (sysWifiInfo.length > 0 && sysWifiInfo[0]) {
      wifiInterface = sysWifiInfo[0];
      wifiInfo.ssid = wifiInterface.ssid;
    }
    if (wifiInterface) {
      const networkInterface = await SysInfo.networkInterfaces();
      const matchedInterface = networkInterface.find((netIf) => netIf.iface === wifiInterface.iface);
      if (matchedInterface) {
        wifiInfo.ipAddress = matchedInterface.ip4 || "";
        wifiInfo.isConnected = true;
      }
    }
    setTimeout(() => {
      this.window.webContents.send(IpcActions_WiFi.WiFiInfoUpdated, wifiInfo);
    }, 3000);
    return wifiInfo;
  }
}