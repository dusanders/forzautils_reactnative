import { Logger } from "../Logger/Logger.js";
import { IpcActions_WiFi, IWiFiInfoState } from 'shared';
import * as SysInfo from 'systeminformation';

const TAG = "WiFiServiceProvider";
export class WifiServiceProvider {
  constructor(private window: Electron.BrowserWindow) {
    Logger.log(TAG, "WiFiServiceProvider initialized");
  }
  attachHandlers(ipcMain: Electron.IpcMain) {
    ipcMain.handle(IpcActions_WiFi.RequestWiFiInfo, () => this.fetchWiFiInfo());
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
    if(wifiInterface) {
      const networkInterface = await SysInfo.networkInterfaces();
      const matchedInterface = networkInterface.find((netIf) => netIf.iface === wifiInterface.iface);
      if (matchedInterface) {
        wifiInfo.ipAddress = matchedInterface.ip4 || "";
        wifiInfo.isConnected = true;
      }
    }
    setTimeout(() => {
      this.window.webContents.send('WiFiInfoUpdated', wifiInfo);
    }, 3000);
    return wifiInfo;
  }
}