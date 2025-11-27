import { Logger } from "@/hooks/Logger";
import { useNetworkService } from "@/services/Forza/NetworkService";
import { RecorderService, useRecorderService } from "@/services/Recorder/RecorderService";
import { useRef, useState } from "react";
import { ITelemetryData, TireData } from "shared";
import { AxleData } from "../types";
import { useOnMount } from "@/hooks/useOnMount";
import SocketService from "@/services/Forza/Provider/Provider";
import { EmitterSubscription, EventEmitter } from "@/helpers/EventEmitter";
import { DataWindow } from "@/helpers/DataWindow";

export interface IGripViewModel {
  steering: number;
  throttle: number;
  brake: number;
  slipRatio: TireData;
  slipRatioDataWindow: DataWindow<AxleData<number>>;
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
      GripViewModelImpl.instance.initialize();
    }
    return GripViewModelImpl.instance;
  }
  private static STATE_CHANGED_EVENT = "STATE_CHANGED_EVENT";

  private networkPacketListener: EmitterSubscription | null = null;
  private replayPacketListener: EmitterSubscription | null = null;
  private stateChangeEmitter: EventEmitter = new EventEmitter(TAG);
  private networkService = SocketService.GetInstance();
  private recorderService = RecorderService.GetInstance();
  state: IGripViewModel = {
    steering: 0,
    throttle: 0,
    brake: 0,
    slipRatio: {
      leftFront: 0,
      rightFront: 0,
      leftRear: 0,
      rightRear: 0
    },
    slipRatioDataWindow: new DataWindow<AxleData<number>>(50,
      (data) => Math.min(data.front, data.rear),
      (data) => Math.max(data.front, data.rear))
  };

  private constructor() {
    GripViewModelImpl.instance = this;
  }
  onStateChanged(listener: (state: IGripViewModel) => void) {
    return this.stateChangeEmitter.addListener(GripViewModelImpl.STATE_CHANGED_EVENT, listener);
  }
  unsubscribe() {
    this.networkPacketListener?.remove();
    this.replayPacketListener?.remove();
  }
  private updateStateFromPacket(packet: ITelemetryData) {
    this.state.slipRatioDataWindow.add({
      front: (packet.tireSlipRatio.leftFront + packet.tireSlipRatio.rightFront) / 2,
      rear: (packet.tireSlipRatio.leftRear + packet.tireSlipRatio.rightRear) / 2
    });
    this.state = {
      ...this.state,
      steering: packet.steer,
      throttle: packet.throttle,
      brake: packet.brake,
      slipRatio: {
        leftFront: packet.tireSlipRatio.leftFront,
        rightFront: packet.tireSlipRatio.rightFront,
        leftRear: packet.tireSlipRatio.leftRear,
        rightRear: packet.tireSlipRatio.rightRear
      },
    };
    this.stateChangeEmitter.emit(GripViewModelImpl.STATE_CHANGED_EVENT, this.state);
  }
  private initialize() {
    this.networkPacketListener = this.networkService.onPacket((packet) => {
      this.updateStateFromPacket(packet);
    });
    this.replayPacketListener = this.recorderService.onPacketEvent((packet, position) => {
      this.updateStateFromPacket(packet);
    });
    Logger.log(TAG, "Subscribed to packets for GripViewModelImpl");
  }
}
export function useGripViewModel(): IGripViewModel {
  const service = useRef(GripViewModelImpl.GetInstance());
  const [state, setState] = useState<IGripViewModel>(service.current.state);

  useOnMount(() => {
    const subscription = service.current.onStateChanged((newState) => {
      setState(newState);
    });
    return () => {
      subscription.remove();
    };
  });
  return state;
}

export function GripViewModel(props: { children?: React.ReactNode }) {
  const serviceRef = useRef<GripViewModelImpl | null>(null);
  useOnMount(() => {
    Logger.log(TAG, "GripViewModel mounted");
    serviceRef.current = GripViewModelImpl.GetInstance();
    return () => {
      Logger.log(TAG, "GripViewModel unmounted");
      serviceRef.current?.unsubscribe();
    };
  });

  return props.children;
}
