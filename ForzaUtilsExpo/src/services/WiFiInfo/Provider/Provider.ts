import { EmitterSubscription } from "react-native";
import { IWiFiInfoService } from "../WiFiInfo.types";
import { Logger } from "@/hooks/Logger";
import { ContextBridge_WiFi, ElectronContextBridge, IWiFiInfoState } from "shared";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";

const TAG = "WifiServiceProvider_web";
const apiBridge = (window as any).electronAPI as ElectronContextBridge;

class WifiServiceProvider implements IWiFiInfoService {
  static Initialize(): Promise<WifiServiceProvider> {
    return new Promise<WifiServiceProvider>((resolve) => {
      if (!WifiServiceProvider.instance) {
        WifiServiceProvider.instance = new WifiServiceProvider();
        WifiServiceProvider.instance.initialize();
      }
      const instance = WifiServiceProvider.instance;
      resolve(instance);
    });
  }
  static GetInstance(): WifiServiceProvider {
    if (!WifiServiceProvider.instance) {
      throw new Error("WifiServiceProvider not initialized. Call Initialize() first.");
    }
    return WifiServiceProvider.instance;
  }
  static IsInitialized(): boolean {
    return !!WifiServiceProvider.instance;
  }

  private static instance: WifiServiceProvider;
  private static WIFI_INFO_UPDATED_EVENT = 'WiFiInfoUpdated';

  state: IWiFiInfoState = {
    ssid: null,
    ipAddress: null,
    isConnected: false,
  };

  private api!: ContextBridge_WiFi;
  private eventEmitter: EventEmitter = new EventEmitter();

  private constructor() {
    if(!apiBridge || !apiBridge.WiFiRequests) {
      throw new Error("Electron Context Bridge API is not available.");
    }
    Logger.log(TAG, "Initializing WifiServiceProvider");
    if (!WifiServiceProvider.instance) {
      WifiServiceProvider.instance = this;
    }
    this.api = apiBridge.WiFiRequests;
    return WifiServiceProvider.instance;
  }

  async fetchWiFiInfo(): Promise<void> {
    if (!this.api || !this.api.requestWiFiInfo) {
      Logger.warn(TAG, "Context bridge for WiFiRequests is not available.");
      return;
    }
    const state = await this.api.requestWiFiInfo();
    Logger.log(TAG, `Fetched WiFi Info: ${JSON.stringify(state)}`);
    this.state = state;
  }

  onWiFiInfoChanged(callback: (state: IWiFiInfoState) => void): EmitterSubscription {
    return this.eventEmitter.addListener(WifiServiceProvider.WIFI_INFO_UPDATED_EVENT, callback);
  }

  private initialize() {
    Logger.log(TAG, "Calling initialize");
    this.fetchWiFiInfo().catch((error) => {
      Logger.error(TAG, `Error fetching initial WiFi info: ${error}`);
    });
    this.api.onWifiInfoUpdated((state: IWiFiInfoState) => {
      Logger.log(TAG, `WiFi Info Updated: ${JSON.stringify(state)}`);
      this.state = state;
      this.eventEmitter.emit(WifiServiceProvider.WIFI_INFO_UPDATED_EVENT, this.state);
    });
  }
}

export default WifiServiceProvider;