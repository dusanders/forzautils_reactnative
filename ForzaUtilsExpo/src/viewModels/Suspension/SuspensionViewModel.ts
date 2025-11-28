import { DataWindow } from "@/helpers/DataWindow";
import { AxleData } from "../types";
import { EmitterSubscription, EventEmitter } from "@/helpers/EventEmitter";
import SocketService from "@/services/Forza/Provider/Provider";
import { RecorderService } from "@/services/Recorder/RecorderService";
import { ITelemetryData } from "shared";
import { useRef, useState } from "react";
import { useOnMount } from "@/hooks/useOnMount";

export interface ISuspensionGraphViewModel {
  leftFront: number;
  leftRear: number;
  rightFront: number;
  rightRear: number;
  leftFrontWindow: DataWindow<number>;
  rightFrontWindow: DataWindow<number>;
  leftRearWindow: DataWindow<number>;
  rightRearWindow: DataWindow<number>;
  avgTravel: DataWindow<AxleData<number>>;
}

const TAG = "SuspensionViewModel";
class SuspensionViewModelImpl {
  static instance: SuspensionViewModelImpl;
  static GetInstance(): SuspensionViewModelImpl {
    if (!SuspensionViewModelImpl.instance) {
      SuspensionViewModelImpl.instance = new SuspensionViewModelImpl();
      SuspensionViewModelImpl.instance.initialize();
    }
    return SuspensionViewModelImpl.instance;
  }
  private static STATE_CHANGED_EVENT = "STATE_CHANGED_EVENT";

  private stateChangeEmitter: EventEmitter = new EventEmitter(TAG);
  private networkPacketListener: EmitterSubscription | null = null;
  private replayPacketListener: EmitterSubscription | null = null;
  private networkService = SocketService.GetInstance();
  private recorderService = RecorderService.GetInstance();
  state: ISuspensionGraphViewModel = {
    leftFront: 0,
    leftRear: 0,
    rightFront: 0,
    rightRear: 0,
    leftFrontWindow: new DataWindow<number>(50,
      (data) => Math.min(data),
      (data) => Math.max(data)),
    rightFrontWindow: new DataWindow<number>(50,
      (data) => Math.min(data),
      (data) => Math.max(data)),
    leftRearWindow: new DataWindow<number>(50,
      (data) => Math.min(data),
      (data) => Math.max(data)),
    rightRearWindow: new DataWindow<number>(50,
      (data) => Math.min(data),
      (data) => Math.max(data)),
    avgTravel: new DataWindow<AxleData<number>>(50,
      (data) => Math.min(data.front, data.rear),
      (data) => Math.max(data.front, data.rear))
  };

  constructor() {
    SuspensionViewModelImpl.instance = this;
  }

  onStateChanged(listener: (state: ISuspensionGraphViewModel) => void) {
    return this.stateChangeEmitter.addListener(SuspensionViewModelImpl.STATE_CHANGED_EVENT, listener);
  }

  private updateStateFromPacket(packet: ITelemetryData) {
    if (!packet.isRaceOn) {
      return;
    }
    if (packet.normalizedSuspensionTravel) {
      this.state.leftFront = packet.normalizedSuspensionTravel.leftFront;
      this.state.rightFront = packet.normalizedSuspensionTravel.rightFront;
      this.state.leftRear = packet.normalizedSuspensionTravel.leftRear;
      this.state.rightRear = packet.normalizedSuspensionTravel.rightRear;
      this.state.leftFrontWindow.add(this.state.leftFront);
      this.state.rightFrontWindow.add(this.state.rightFront);
      this.state.leftRearWindow.add(this.state.leftRear);
      this.state.rightRearWindow.add(this.state.rightRear);

      const frontAvg = (this.state.leftFront + this.state.rightFront) / 2;
      const rearAvg = (this.state.leftRear + this.state.rightRear) / 2;
      this.state.avgTravel.add({
        front: frontAvg,
        rear: rearAvg
      });
      this.state = {
        ...this.state,
      }
      this.stateChangeEmitter.emit(SuspensionViewModelImpl.STATE_CHANGED_EVENT, this.state);
    }
  }

  unsubscribe() {
    this.networkPacketListener?.remove();
    this.replayPacketListener?.remove();
  }

  private initialize() {
    this.state.leftFrontWindow = new DataWindow<number>(50,
      (data) => Math.min(data, this.state.leftFront),
      (data) => Math.max(data, this.state.leftFront));
    this.state.rightFrontWindow = new DataWindow<number>(50,
      (data) => Math.min(data, this.state.rightFront),
      (data) => Math.max(data, this.state.rightFront));
    this.state.leftRearWindow = new DataWindow<number>(50,
      (data) => Math.min(data, this.state.leftRear),
      (data) => Math.max(data, this.state.leftRear));
    this.state.rightRearWindow = new DataWindow<number>(50,
      (data) => Math.min(data, this.state.rightRear),
      (data) => Math.max(data, this.state.rightRear));
    this.networkPacketListener = this.networkService.onPacket((packet) => {
      this.updateStateFromPacket(packet);
    });
    this.replayPacketListener = this.recorderService.onPacketEvent((packet) => {
      this.updateStateFromPacket(packet);
    });
  }
}

export function useSuspensionViewModel(): ISuspensionGraphViewModel {
  const service = useRef(SuspensionViewModelImpl.GetInstance());
  const [state, setState] = useState(service.current.state);
  useOnMount(() => {
    const sub = service.current.onStateChanged((newState) => {
      setState(newState);
    });
    return () => {
      sub.remove();
    };
  });
  return state;
}

export function SuspensionViewModel(props: { children?: React.ReactNode }) {
  const serviceRef = useRef<SuspensionViewModelImpl | null>(null);
  useOnMount(() => {
    serviceRef.current = SuspensionViewModelImpl.GetInstance();
    return () => {
      serviceRef.current?.unsubscribe();
      serviceRef.current = null;
    };
  });
  return props.children;
}