import { NativeStackNavigationProp } from "@react-navigation/native-stack";

/**
 * Add Type for react-native-udp 'rinfo' object
 */
export interface Upd_rinfo {
  address: string,
  port: number,
  family: 'IPv4',
  size: number,
  ts: number,
}

/**
 * Add type for reducer function
 * @param prev Previous state
 * @param next Next state
 * @returns New state
 */
export type StateHandler<T> = (prev: T, next: Partial<T>) => T;

/**
 * Define the Navigation stack for the app
 */
export type RootStackParamList = Record<AppRoutes, undefined>;

/**
 * Define the navigation type for the app
 */
export type StackNavigation = NativeStackNavigationProp<RootStackParamList>;

/**
 * Define the port to use for the UDP listener
 */
export const LISTEN_PORT = 5300;

/**
 * Define the app routes
 */
export enum AppRoutes {
  SPLASH = 'splash',
  IP_INFO = 'ip_info',
  DATA = 'data',
  HP_TQ_GRAPH = 'hp_tq_graph',
  SUSPENSION_GRAPH = 'suspension_graph',
  TIRE_TEMPS = 'tire_temps',
  GRIP = 'grip',
  SOURCE_CHOOSER = 'source_chooser',
  TUNING_CALCULATOR = 'tuning_calculator',
}

/**
 * A generic function to delay execution
 * @param delay Delay in milliseconds
 * @returns 
 */
export function delay(delay: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  })
}

/**
 * Simple function to generate a random key
 * @returns A random key in the format xxxxx-xxxx-4xxx
 */
export function randomKey(): string {
  let
    d = new Date().getTime(),
    d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxx-xxxx-4xxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
}