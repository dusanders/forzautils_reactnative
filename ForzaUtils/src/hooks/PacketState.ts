import { ITelemetryData } from 'ForzaTelemetryApi';
import {atom, useAtomValue, useSetAtom} from 'jotai';

export interface IPacketState {
  packet: ITelemetryData | undefined;
}

const initialState: IPacketState = {
  packet: undefined,
};
const packetState = atom<IPacketState>(initialState);
const packetAtom = atom((get) => get(packetState).packet);
const setPacketAtom = atom(
  null,
  (get, set, newPacket: ITelemetryData | undefined) => {
    const currentState = get(packetState);
    set(packetState, { ...currentState, packet: newPacket });
  }
);

export function packetService() {
  const packet = useAtomValue(packetAtom);
  const setPacket = useSetAtom(setPacketAtom);

  return {
    packet,
    setPacket,
    resetState: () => {
      setPacket(undefined);
    },
  };
}