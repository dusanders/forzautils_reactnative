import { ITelemetryData } from 'ForzaTelemetryApi';
import {atom} from 'jotai';

export interface IPacketState {
  packet: ITelemetryData | undefined;
}

export const initialState: IPacketState = {
  packet: undefined,
};
export const packetState = atom<IPacketState>(initialState);
export const packetAtom = atom((get) => get(packetState).packet);