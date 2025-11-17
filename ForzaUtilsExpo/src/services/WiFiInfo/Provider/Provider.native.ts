import { EmitterSubscription } from "react-native";
import { Logger } from "@/hooks/Logger";
import { IWiFiInfoState } from "shared";
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import { BaseWiFiInfoProvider } from "./BaseProvider";

const TAG = "WifiServiceProvider_native";
class WifiServiceProvider extends BaseWiFiInfoProvider {
  static async Initialize(): Promise<WifiServiceProvider> {
    if (!BaseWiFiInfoProvider.instance) {
      BaseWiFiInfoProvider.instance = new WifiServiceProvider();
      await (BaseWiFiInfoProvider.instance as WifiServiceProvider).initialize();
    }
    return BaseWiFiInfoProvider.instance as WifiServiceProvider;
  }

  static instance: WifiServiceProvider;
  private static WIFI_INFO_UPDATED_EVENT = 'WiFiInfoUpdated';

  private netInfoSubscription: NetInfoSubscription | undefined
  private emitter: EventEmitter = new EventEmitter();

  state: IWiFiInfoState = {
    ssid: null,
    ipAddress: null,
    isConnected: false,
  };

  private constructor() {
    super();
    Logger.log(TAG, "Initializing WifiServiceProvider");
  }

  async shutdown(): Promise<void> {
    if (this.netInfoSubscription) {
      this.netInfoSubscription();
      this.netInfoSubscription = undefined;
    }
    this.emitter.removeAllListeners();
    Logger.log(TAG, "WifiServiceProvider shutdown complete");
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