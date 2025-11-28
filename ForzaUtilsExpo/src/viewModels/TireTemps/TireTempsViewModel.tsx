import { DataWindow } from "@/helpers/DataWindow";
import { ITelemetryData, TireData } from "shared";
import { AxleData } from "../types";
import { EmitterSubscription, EventEmitter } from "@/helpers/EventEmitter";
import { RecorderService } from "@/services/Recorder/RecorderService";
import SocketService from "@/services/Forza/Provider/Provider";
import { useRef, useState } from "react";
import { useOnMount } from "@/hooks/useOnMount";
import { Logger } from "@/hooks/Logger";


export interface ITireTempViewModel {
  tireDataWindow: DataWindow<TireData>;
  avgTemps: DataWindow<AxleData<number>>;
}

const TAG = "TireTempsViewModel";
class TireTempsViewModelImpl {
  static instance: TireTempsViewModelImpl;
  static GetInstance(): TireTempsViewModelImpl {
    if (!TireTempsViewModelImpl.instance) {
      TireTempsViewModelImpl.instance = new TireTempsViewModelImpl();
      TireTempsViewModelImpl.instance.initialize();
    }
    return TireTempsViewModelImpl.instance;
  }
  private static STATE_CHANGED_EVENT = "STATE_CHANGED_EVENT";

  private stateChangeEmitter: EventEmitter = new EventEmitter(TAG);
  private networkPacketListener: EmitterSubscription | null = null;
  private replayPacketListener: EmitterSubscription | null = null;
  private networkService = SocketService.GetInstance();
  private recorderService = RecorderService.GetInstance();
  state: ITireTempViewModel = {
    tireDataWindow: new DataWindow<TireData>(50,
      (data) => Math.min(data.leftFront, data.rightFront, data.leftRear, data.rightRear),
      (data) => Math.max(data.leftFront, data.rightFront, data.leftRear, data.rightRear)),
    avgTemps: new DataWindow<AxleData<number>>(50,
      (data) => Math.min(data.front, data.rear),
      (data) => Math.max(data.front, data.rear)),
  };

  constructor() {
    TireTempsViewModelImpl.instance = this;
  }

  unsubscribe() {
    this.networkPacketListener?.remove();
    this.replayPacketListener?.remove();
  }

  onStateChanged(listener: (state: ITireTempViewModel) => void) {
    return this.stateChangeEmitter.addListener(TireTempsViewModelImpl.STATE_CHANGED_EVENT, listener);
  }

  private handleTelemetryPacket(packet: ITelemetryData) {
    if (!packet.isRaceOn) {
      return;
    }
    if (packet.tireTemp) {
      const leftFront = Number(packet.tireTemp.leftFront?.toFixed(2)) || 0;
      const rightFront = Number(packet.tireTemp.rightFront?.toFixed(2)) || 0;
      const leftRear = Number(packet.tireTemp.leftRear?.toFixed(2)) || 0;
      const rightRear = Number(packet.tireTemp.rightRear?.toFixed(2)) || 0;
      const frontAvg = (leftFront + rightFront) / 2;
      const rearAvg = (leftRear + rightRear) / 2;
      this.state.avgTemps.add({
        front: Number(frontAvg.toFixed(2)),
        rear: Number(rearAvg.toFixed(2))
      });
      this.state.tireDataWindow.add({
        leftFront,
        rightFront,
        leftRear,
        rightRear,
      });
      this.state = {
        ...this.state,
      }
      this.stateChangeEmitter.emit(TireTempsViewModelImpl.STATE_CHANGED_EVENT, this.state);
    }
  }

  private initialize() {
    this.networkPacketListener = this.networkService.onPacket((packet) => {
      this.handleTelemetryPacket(packet);
    });
    this.replayPacketListener = this.recorderService.onPacketEvent((packet) => {
      this.handleTelemetryPacket(packet);
    });
  }
}

export function useTireTempsViewModel(): ITireTempViewModel {
  const service = useRef(TireTempsViewModelImpl.GetInstance());
  const [state, setState] = useState<ITireTempViewModel>(service.current.state);
  
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

export function TireTempsViewModel(props: {children?: React.ReactNode}) {
  const serviceRef = useRef<TireTempsViewModelImpl | null>(null);
  useOnMount(() => {
    Logger.log(TAG, "TireTempsViewModel mounted");
    serviceRef.current = TireTempsViewModelImpl.GetInstance();
    return () => {
      Logger.log(TAG, "TireTempsViewModel unmounted");
      serviceRef.current?.unsubscribe();
    };
  });
  return props.children;
}