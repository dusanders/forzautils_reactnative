
export enum ReplayState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
}

export interface IRecorderState {
  replayState: ReplayState;
  replayPosition: number;
  replayLength: number;
}

export interface IRecorderService {
  state: IRecorderState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  loadReplay: (sessionName: string) => Promise<void>;
  deleteReplay: (sessionName: string) => Promise<void>;
  closeRecording: () => Promise<void>;
  resume: () => Promise<void>;
  restart: () => Promise<void>;
  pause: () => Promise<void>;
  closeReplay: () => Promise<void>;
  seek: (position: number) => void;
}

