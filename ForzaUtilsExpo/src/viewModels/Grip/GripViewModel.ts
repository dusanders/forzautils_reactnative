import { Logger } from "@/hooks/Logger";
import { useNetworkService } from "@/services/Forza/NetworkService";
import { RecorderServiceProvider, useRecorderService } from "@/services/Recorder/RecorderService";
import { useRef, useState } from "react";
import { EmitterSubscription } from "react-native";
import { ITelemetryData, TireData } from "shared";
import { AxleData } from "../types";
import { useOnMount } from "@/hooks/useOnMount";
import SocketService from "@/services/Forza/Provider/Provider";

export interface IGripViewModel {
  steering: number;
  throttle: number;
  brake: number;
  slipRatio: TireData;
  slipAngle: AxleData<number>[];
  slipAngleWindowSize: number;
  slipAngleMin: number;
  slipAngleMax: number;
}

interface GripViewModelState extends IGripViewModel {
  // Additional internal state if needed
}

const TAG = "GripViewModel";
class GripViewModelImpl {

  static instance: GripViewModelImpl;
  static GetInstance(): GripViewModelImpl {
    if (!GripViewModelImpl.instance) {
      GripViewModelImpl.instance = new GripViewModelImpl();
    }
    return GripViewModelImpl.instance;
  }

  private networkPacketListener: EmitterSubscription | null = null;
  private replayPacketListener: EmitterSubscription | null = null;
  private networkService = SocketService.GetInstance();
  
  private constructor() {
    GripViewModelImpl.instance = this;
  }
  unsubscribe() {
    this.networkPacketListener?.remove();
    this.replayPacketListener?.remove();
  }
}
export function useGripViewModel(): IGripViewModel {
  const networkPacketListener = useRef<EmitterSubscription | null>(null);
  const replayPacketListener = useRef<EmitterSubscription | null>(null);
  const [state, setState] = useState<GripViewModelState>({
    steering: 0,
    throttle: 0,
    brake: 0,
    slipRatio: {
      leftFront: 0,
      rightFront: 0,
      leftRear: 0,
      rightRear: 0
    },
    slipAngle: [],
    slipAngleWindowSize: 50,
    slipAngleMin: 0,
    slipAngleMax: 0
  });
  const network = useNetworkService();
  const replay = useRecorderService();

  const updateStateFromPacket = (packet: ITelemetryData) => {
    setState((prevState) => ({
      ...prevState,
      steering: packet.steer || prevState.steering,
      throttle: packet.throttle || prevState.throttle,
      brake: packet.brake || prevState.brake,
      slipRatio: packet.tireSlipRatio
        ? {
          leftFront: Number(packet.tireSlipRatio.leftFront.toFixed(2)),
          rightFront: Number(packet.tireSlipRatio.rightFront.toFixed(2)),
          leftRear: Number(packet.tireSlipRatio.leftRear.toFixed(2)),
          rightRear: Number(packet.tireSlipRatio.rightRear.toFixed(2))
        }
        : prevState.slipRatio,
      // Update slipAngle and other properties as needed
    }));
  };

  useOnMount(() => {
    Logger.log(TAG, "GripViewModel mounted");
    networkPacketListener.current = network.onPacket((packet) => {
      updateStateFromPacket(packet);
    });
    replayPacketListener.current = replay.onPacketEvent((packet) => {
      updateStateFromPacket(packet);
    });
    Logger.log(TAG, "Subscribed to packets for GripViewModel");
    return () => {
      replayPacketListener.current?.remove();
      networkPacketListener.current?.remove();
      Logger.log(TAG, "GripViewModel unmounted and unsubscribed from packets");
    };
  });

  return state;
}

export function GripViewModel(props: { children?: React.ReactNode }) {
  useOnMount(() => () => {
    GripViewModelImpl.GetInstance().unsubscribe();
  })
  return props.children;
}
