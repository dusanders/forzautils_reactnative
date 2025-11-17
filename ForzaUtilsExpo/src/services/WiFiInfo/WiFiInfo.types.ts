import { EmitterSubscription } from 'react-native';
import { IWiFiInfoState } from 'shared';

export interface IWifiContext {
  wifiState: IWiFiInfoState;
}

export interface INativeWifiService {
  state: IWiFiInfoState;
  fetchWiFiInfo: () => Promise<void>;
  onWiFiInfoChanged: (callback: (state: IWiFiInfoState) => void) => EmitterSubscription;
  shutdown(): Promise<void>;
}