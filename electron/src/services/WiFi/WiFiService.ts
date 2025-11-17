import { Logger } from "../Logger/Logger.js";
import { ForzaTelemetryApi, IpcActions_UDP, IpcActions_WiFi, IWiFiInfoState } from 'shared';
import * as SysInfo from 'systeminformation';
import * as dgram from 'dgram';

const TAG = "WiFiServiceProvider";
export class WifiServiceProvider {

  private udpPort: number = -1;
  private socket: dgram.Socket | null = null;

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
    return new Promise<number>((resolve, reject) => {
      Logger.log(TAG, `Opening UDP Socket on port ${port}`);
      try {
        this.socket = dgram.createSocket('udp4');
        this.socket.once('error', (err) => {
          Logger.error(TAG, `UDP Socket error: ${err.message}`);
          this.socket?.close();
        });
        this.socket.once('listening', () => {
          Logger.log(TAG, `UDP Socket listening on port ${this.socket?.address().port}`);
          this.udpPort = this.socket?.address().port ?? -1;
          this.socket?.on('error', this.onSocketError.bind(this));
          this.socket?.on('close', this.onSocketClosed.bind(this));
          this.socket?.on('message', this.onSocketData.bind(this));
          resolve(this.udpPort);
        });
        this.socket.bind(port);
      } catch (error) {
        reject(error);
      }
    });
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
    this.window.webContents.send(IpcActions_UDP.SocketError, error);
  }

  private onSocketClosed() {
    Logger.log(TAG, `UDP Socket closed`);
    this.udpPort = -1;
    this.window.webContents.send(IpcActions_UDP.SocketClosed);
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