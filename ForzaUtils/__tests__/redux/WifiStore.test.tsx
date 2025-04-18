import { configureStore } from "@reduxjs/toolkit";
import { wifiReducer, setWifiState, setPort, setUdpListening } from "../../src/redux/WifiStore";

describe("WifiStore Redux Slice", () => {
  const store = configureStore({ reducer: { wifi: wifiReducer } });

  it("should return the initial state", () => {
    const state = store.getState().wifi;
    expect(state).toEqual({
      isConnected: false,
      isUdpListening: false,
      port: 0,
      ip: "",
      packet: undefined,
    });
  });

  it("should handle setWifiState", () => {
    const newState = {
      isConnected: true,
      isUdpListening: true,
      port: 8080,
      ip: "192.168.1.1",
      packet: undefined,
    };
    store.dispatch(setWifiState(newState));
    const state = store.getState().wifi;
    expect(state).toEqual(newState);
  });

  it("should handle setPort", () => {
    store.dispatch(setPort(3000));
    const state = store.getState().wifi;
    expect(state.port).toBe(3000);
  });

  it("should handle setUdpListening", () => {
    store.dispatch(setUdpListening(true));
    const state = store.getState().wifi;
    expect(state.isUdpListening).toBe(true);
  });
});