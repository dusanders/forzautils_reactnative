import { ContextBridge_Cache } from './Storage/Cache.js';
import { ContextBridge_UDP, ContextBridge_WiFi } from './WiFi/WiFi.types.js';

export * from 'ForzaTelemetryApi';

export * from './WiFi/WiFi.types.js';

export * from './Storage/Cache.js';

export interface ElectronContextBridge {
  WiFiRequests: ContextBridge_WiFi;
  UDPRequests: ContextBridge_UDP;
  CacheRequests: ContextBridge_Cache;
}