import React, { useRef } from "react";
import DatabaseService from "./Database/Database";
import { ISessionInfo, ITelemetryData } from "shared";
import { useOnMount } from "@/hooks/useOnMount";
import { ISession } from "./DatabaseInterfaces";
import { EmitterSubscription } from "react-native";
import { Semaphore } from "@/helpers/Semaphore";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";

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
  sessions: ISession[];
  onPacketEvent: (callback: (packet: ITelemetryData) => void) => EmitterSubscription;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  loadReplay: (sessionName: string) => Promise<ISessionInfo | null>;
  deleteReplay: (sessionName: string) => Promise<void>;
  closeRecording: () => Promise<void>;
  resume: () => Promise<void>;
  restart: () => Promise<void>;
  pause: () => Promise<void>;
  closeReplay: () => Promise<void>;
  seek: (position: number) => Promise<void>;
}

export interface RecorderServiceProps {
  children?: React.ReactNode;
}

const RecorderContext = React.createContext<IRecorderService | null>(null);

const TAG = "RecorderService.tsx";
export class RecorderService implements IRecorderService {
  static Events = {
    PACKET: 'packet',
    STATE_CHANGE: 'state_change',
  }
  static instance: RecorderService | null = null;
  static async Initialize(): Promise<RecorderService> {
    if (!RecorderService.instance) {
      RecorderService.instance = new RecorderService();
      await RecorderService.instance.initialize();
    }
    return RecorderService.instance;
  }
  static GetInstance(): RecorderService {
    if (!RecorderService.instance) {
      throw new Error("RecorderService is not initialized. Call Initialize() first.");
    }
    return RecorderService.instance;
  }

  private databaseProvider: DatabaseService;
  private playbackSemaphore: Semaphore = new Semaphore(1);
  private eventEmitter: EventEmitter = new EventEmitter();
  private currentReplaySession: ISession | null = null;
  private currentRecordingSession: ISession | null = null;
  state: IRecorderState;
  sessions: ISession[];

  private constructor() {
    this.databaseProvider = new DatabaseService();
    this.state = {
      replayState: ReplayState.IDLE,
      replayPosition: 0,
      replayLength: 0,
    };
    this.sessions = [];
  }
  onStateChange(callback: (state: IRecorderState) => void): EmitterSubscription {
    return this.eventEmitter.addListener(RecorderService.Events.STATE_CHANGE, callback);
  }
  onPacketEvent(callback: (packet: ITelemetryData) => void): EmitterSubscription {
    return this.eventEmitter.addListener(RecorderService.Events.PACKET, callback);
  }
  async startRecording(): Promise<void> {
    const newSession = await this.databaseProvider.generateSession();
    this.currentRecordingSession = newSession;
    this.sessions.push(newSession);
    this.state.replayState = ReplayState.RECORDING;
    this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
  }
  async stopRecording(): Promise<void> {
    this.currentRecordingSession?.close();
    this.currentRecordingSession = null;
    this.state.replayLength = 0;
    this.state.replayPosition = 0;
    this.state.replayState = ReplayState.IDLE;
    this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
  }
  async loadReplay(sessionName: string): Promise<ISessionInfo | null> {
    this.currentReplaySession = this.sessions.find(s => s.info.name === sessionName) || null;
    if (this.currentReplaySession) {
      this.state.replayLength = 0;
      this.state.replayPosition = 0;
      this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
    }
    return this.currentReplaySession?.info || null;
  }
  async deleteReplay(sessionName: string): Promise<void> {
    const session = this.sessions.find(s => s.info.name === sessionName);
    if (session) {
      await session.delete();
      this.sessions = this.sessions.filter(s => s.info.name !== sessionName);
    }
    this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
  }
  async closeRecording(): Promise<void> {
    if (this.currentRecordingSession) {
      this.currentRecordingSession.close();
      this.currentRecordingSession = null;
    }
    this.state.replayState = ReplayState.IDLE;
    this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
  }
  async resume(): Promise<void> {
    await this.playbackSemaphore.acquire();
    if (this.currentReplaySession) {
      this.state.replayState = ReplayState.PLAYING;
      this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
    }
    this.playbackSemaphore.release();
  }
  async restart(): Promise<void> {
    await this.playbackSemaphore.acquire();
    if (this.currentReplaySession) {
      this.state.replayPosition = 0;
      this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
    }
    this.playbackSemaphore.release();
  }
  async pause(): Promise<void> {
    await this.playbackSemaphore.acquire();
    if (this.currentReplaySession) {
      this.state.replayState = ReplayState.PAUSED;
      this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
    }
    this.playbackSemaphore.release();
  }
  async closeReplay(): Promise<void> {
    this.currentReplaySession = null;
    this.state.replayState = ReplayState.IDLE;
    this.state.replayPosition = 0;
    this.state.replayLength = 0;
    this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
  }
  async seek(position: number): Promise<void> {
    await this.playbackSemaphore.acquire();
    if (this.currentReplaySession) {
      this.state.replayPosition = position;
      this.eventEmitter.emit(RecorderService.Events.STATE_CHANGE, this.state);
    }
    this.playbackSemaphore.release();
  }
  private async initialize() {
    await this.databaseProvider.initialize();
    this.sessions = await this.databaseProvider.getAllSessions();
  }
}

export function RecorderServiceProvider(props: RecorderServiceProps) {
  const serviceRef = useRef<RecorderService>(RecorderService.GetInstance());
  const serviceStateChangeListener = useRef<EmitterSubscription | null>(null);
  const [state, setState] = React.useState<IRecorderState>(serviceRef.current.state);
  const [sessions, setSessions] = React.useState<ISession[]>(serviceRef.current.sessions);

  useOnMount(() => {
    serviceStateChangeListener.current = serviceRef.current.onStateChange((newState) => {
      setState({ ...newState });
      setSessions([...serviceRef.current.sessions]);
    });
    return () => {
      serviceStateChangeListener.current?.remove();
    }
  });

  return (
    <RecorderContext.Provider value={{
      state: state,
      sessions: sessions,
      onPacketEvent: (fn) => serviceRef.current.onPacketEvent(fn),
      startRecording: () => serviceRef.current.startRecording(),
      stopRecording: () => serviceRef.current.stopRecording(),
      loadReplay: (sessionName) => serviceRef.current.loadReplay(sessionName),
      deleteReplay: (sessionName) => serviceRef.current.deleteReplay(sessionName),
      closeRecording: () => serviceRef.current.closeRecording(),
      resume: () => serviceRef.current.resume(),
      restart: () => serviceRef.current.restart(),
      pause: () => serviceRef.current.pause(),
      closeReplay: () => serviceRef.current.closeReplay(),
      seek: (position: number) => serviceRef.current.seek(position),
    }}>
      {props.children}
    </RecorderContext.Provider>
  );
}

export function useRecorderService(): IRecorderService {
  const context = React.useContext(RecorderContext);
  if (!context) {
    throw new Error('useRecorderService must be used within a RecorderServiceProvider');
  }
  return context;
}