import { atom, useAtomValue, useSetAtom } from "jotai";

export interface IWifiState {
  isConnected: boolean;
  isUdpListening: boolean;
  port: number;
  ip: string;
}

const initialState: IWifiState = {
  isConnected: false,
  isUdpListening: false,
  port: 0,
  ip: ""
};
const wifiState = atom<IWifiState>(initialState);
const setWifiState = atom(
  null,
  (get, set, newState: Partial<IWifiState>) => {
    const currentState = get(wifiState);
    set(wifiState, { ...currentState, ...newState });
  }
);
export function wifiService() {
  const wifi = useAtomValue(wifiState);
  const setWifi = useSetAtom(setWifiState);

  return {
    wifi,
    setWifi,
    resetState: () => {
      setWifi(initialState);
    }
  };
}