import { Logger } from "@/hooks/Logger";

export class EventEmitter {
  private listeners: Map<string, Set<Function>> = new Map();
  private instanceName: string | undefined;
  private TAG = () => `EventEmitter${this.instanceName ?? ''}`;
  constructor(instanceName?: string) {
    this.instanceName = instanceName;
  }

  addListener(event: string, listener: Function): EmitterSubscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(listener);
    Logger.log(this.TAG(), `addListener for event ${event} :: total listeners: ${this.listeners.get(event)?.size}`);
    return {
      remove: () => this.removeListener(event, listener)
    };
  }

  removeListener(event: string, listener: Function): void {
    this.listeners.get(event)?.delete(listener);
    Logger.log(this.TAG(), `removeListener for event ${event} :: remaining listeners: ${this.listeners.get(event)?.size}`);
  }

  emit(event: string, ...args: any[]): void {
    this.listeners.get(event)?.forEach(listener => listener(...args));
  }
  removeAllListeners(): void {
    this.listeners.clear();
  }
}

export interface EmitterSubscription {
  remove: () => void;
}