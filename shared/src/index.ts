import { ContextBridge_Cache } from './Storage/Cache.js';
import { ContextBridge_Database, ContextBridge_Session } from './Storage/Database.js';
import { ContextBridge_UDP, ContextBridge_WiFi } from './WiFi/WiFi.types.js';

export * from 'ForzaTelemetryApi';

export * from './WiFi/WiFi.types.js';

export * from './Storage/Cache.js';

export * from './Storage/Database.js';

export interface ElectronContextBridge {
  WiFiRequests: ContextBridge_WiFi;
  UDPRequests: ContextBridge_UDP;
  CacheRequests: ContextBridge_Cache;
  DatabaseRequests: ContextBridge_Database;
  SessionRequests: ContextBridge_Session;
}