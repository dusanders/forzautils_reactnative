import { EmitterSubscription, EventEmitter } from "@/helpers/EventEmitter";
import { useOnMount } from "@/hooks/useOnMount";
import SocketService from "@/services/Forza/Provider/Provider";
import { RecorderService } from "@/services/Recorder/RecorderService";
import { useRef, useState } from "react";
import { ForzaTelemetryApi, ITelemetryData } from "shared";

export interface HpTqReading {
  rpm: number;
  horsepower: number;
  torque: number;
  gear: number;
}
type gear_key = number;
type rpm_key = number;

export interface IHpTqViewModelState {
  gears: Map<gear_key, Map<rpm_key, HpTqReading>>;
}
export interface IHpTqViewModel extends IHpTqViewModelState {
  clearCache: () => void;
}

class HpTqViewModelImpl {
  static instance: HpTqViewModelImpl;
  static GetInstance(): HpTqViewModelImpl {
    if (!HpTqViewModelImpl.instance) {
      HpTqViewModelImpl.instance = new HpTqViewModelImpl();
      HpTqViewModelImpl.instance.initialize();
    }
    return HpTqViewModelImpl.instance;
  }
  private static STATE_CHANGED_EVENT = "STATE_CHANGED_EVENT";

  private stateChangeEmitter: EventEmitter = new EventEmitter("HpTqViewModel");
  private networkPacketListener: EmitterSubscription | null = null;
  private replayPacketListener: EmitterSubscription | null = null;
  private networkService = SocketService.GetInstance();
  private recorderService = RecorderService.GetInstance();
  state: IHpTqViewModelState = {
    gears: new Map<gear_key, Map<rpm_key, HpTqReading>>()
  };

  constructor() {
    HpTqViewModelImpl.instance = this;
  }

  clearCache() {
    this.state = {
      gears: new Map<gear_key, Map<rpm_key, HpTqReading>>()
    };
    this.stateChangeEmitter.emit(HpTqViewModelImpl.STATE_CHANGED_EVENT, this.state);
  }

  onStateChanged(listener: (state: IHpTqViewModel) => void) {
    return this.stateChangeEmitter.addListener(HpTqViewModelImpl.STATE_CHANGED_EVENT, listener);
  }

  unsubscribe() {
    this.networkPacketListener?.remove();
    this.replayPacketListener?.remove();
  }

  private handlePacket(packet: ITelemetryData) {
    const rpm = packet.rpmData.current;
    const horsepower = ForzaTelemetryApi.getHorsepower(packet.power);
    const torque = packet.torque;
    const gear = packet.gear;

    const reading: HpTqReading = {
      rpm,
      horsepower,
      torque,
      gear
    };

    if (!this.state.gears.has(gear)) {
      this.state.gears.set(gear, new Map<rpm_key, HpTqReading>());
    }
    const gearMap = this.state.gears.get(gear)!;
    if (!gearMap.has(rpm)) {
      gearMap.set(rpm, reading);
    } else {
      const existing = gearMap.get(rpm)!;
      // Update only if the new reading has higher horsepower
      if (horsepower > existing.horsepower) {
        gearMap.set(rpm, reading);
      }
    }

    this.state = {
      ...this.state,
    };
    this.stateChangeEmitter.emit(HpTqViewModelImpl.STATE_CHANGED_EVENT, this.state);
  }

  private initialize() {
    this.networkPacketListener = this.networkService.onPacket((packet) => {
      // Handle incoming packets and update state accordingly
      this.handlePacket(packet);
    });

    this.replayPacketListener = this.recorderService.onPacketEvent((packet) => {
      // Handle replay packets and update state accordingly
      this.handlePacket(packet);
    });
  }
}

export function useHpTqViewModel(): IHpTqViewModel {
  const serviceRef = useRef<HpTqViewModelImpl>(HpTqViewModelImpl.GetInstance());
  const [state, setState] = useState<IHpTqViewModelState>(serviceRef.current.state);

  useOnMount(() => {
    const subscription = serviceRef.current.onStateChanged((newState) => {
      setState(newState);
    });
    return () => {
      subscription.remove();
    };
  });

  return {
    ...state,
    clearCache: () => serviceRef.current?.clearCache()
  };
}

export function HpTqViewModel(props: { children?: React.ReactNode }) {
  const serviceRef = useRef<HpTqViewModelImpl | null>(null);
  useOnMount(() => {
    serviceRef.current = HpTqViewModelImpl.GetInstance();
    return () => {
      serviceRef.current?.unsubscribe();
      serviceRef.current = null;
    };
  });
  return props.children;
}
