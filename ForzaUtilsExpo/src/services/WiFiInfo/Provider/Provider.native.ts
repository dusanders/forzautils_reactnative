import { EmitterSubscription } from "react-native";
import { IWiFiInfoService } from "../WiFiInfo.types";
import { Logger } from "@/hooks/Logger";
import { IWiFiInfoState } from "shared";
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";

const TAG = "WifiServiceProvider_native";
class WifiServiceProvider implements IWiFiInfoService {
  static async Initialize(): Promise<WifiServiceProvider> {
    if (!WifiServiceProvider.instance) {
      WifiServiceProvider.instance = new WifiServiceProvider();
      await WifiServiceProvider.instance.initialize();
    }
    return WifiServiceProvider.instance;
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

  private netInfoSubscription: NetInfoSubscription | undefined
  private emitter: EventEmitter = new EventEmitter();

  state: IWiFiInfoState = {
    ssid: null,
    ipAddress: null,
    isConnected: false,
  };

  private constructor() {
    Logger.log(TAG, "Initializing WifiServiceProvider");
    if (!WifiServiceProvider.instance) {
      WifiServiceProvider.instance = this;
    }
    return WifiServiceProvider.instance;
  }

  async fetchWiFiInfo(): Promise<void> {
    const state = await NetInfo.fetch();
    if (!state || state.type !== 'wifi') {
      this.state.isConnected = false;
      this.state.ipAddress = null;
      this.state.ssid = null;
    } else if (state.type === 'wifi' && state.isConnected) {
      this.state.isConnected = true;
      this.state.ipAddress = state.details.ipAddress || null;
      this.state.ssid = state.details.ssid || null;
    }
    Logger.log(TAG, `WiFi Info Fetched: ${JSON.stringify(this.state)}`);
    this.emitter.emit(WifiServiceProvider.WIFI_INFO_UPDATED_EVENT, this.state);
  }

  onWiFiInfoChanged(callback: (state: IWiFiInfoState) => void): EmitterSubscription {
    return this.emitter.addListener(WifiServiceProvider.WIFI_INFO_UPDATED_EVENT, callback);
  }

  private initialize() {
    this.netInfoSubscription = NetInfo.addEventListener((state) => {
      if (!state || state.type !== 'wifi') {
        this.state.isConnected = false;
        this.state.ipAddress = null;
        this.state.ssid = null;
      } else if (state.type === 'wifi' && state.isConnected) {
        this.state.isConnected = true;
        this.state.ipAddress = state.details.ipAddress || null;
        this.state.ssid = state.details.ssid || null;
      }
      Logger.log(TAG, `WiFi Info Updated: ${JSON.stringify(this.state)}`);
      this.emitter.emit(WifiServiceProvider.WIFI_INFO_UPDATED_EVENT, this.state);
    });
  }
}

export default WifiServiceProvider;