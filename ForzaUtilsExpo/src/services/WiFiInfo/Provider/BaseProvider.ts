import { IWiFiInfoState } from "shared";
import { INativeWifiService } from "../WiFiInfo.types";
import { EmitterSubscription } from "react-native";

export abstract class BaseWiFiInfoProvider implements INativeWifiService {
  protected static instance: BaseWiFiInfoProvider | null = null;

  static async Initialize<T extends BaseWiFiInfoProvider>(this: new () => T): Promise<BaseWiFiInfoProvider> {
    if (!BaseWiFiInfoProvider.instance) {
      BaseWiFiInfoProvider.instance = new this();
    }
    return BaseWiFiInfoProvider.instance;
  }

  static GetInstance(): BaseWiFiInfoProvider {
    if (!BaseWiFiInfoProvider.instance) {
      throw new Error("WiFiInfoProvider not initialized. Call Initialize() first.");
    }
    return BaseWiFiInfoProvider.instance;
  }

  static IsInitialized(): boolean {
    return !!BaseWiFiInfoProvider.instance;
  }
  state: IWiFiInfoState = {
    ssid: null,
    ipAddress: null,
    isConnected: false,
  };
  abstract fetchWiFiInfo(): Promise<void>;
  abstract onWiFiInfoChanged(callback: (state: IWiFiInfoState) => void): EmitterSubscription;
  abstract shutdown(): Promise<void>;
}