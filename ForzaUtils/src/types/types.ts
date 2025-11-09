import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ReplayRouteParams } from "../pages/ReplayList/ReplayList";

/**
 * Add type for generic axle data
 * @template T Type of data for the axle
 * @property front Data for the front axle
 * @property rear Data for the rear axle
 */
export interface AxleData<T> {
  front: T;
  rear: T;
}

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
export type RootStackParamList = {
  [AppRoutes.SPLASH]: undefined;
  [AppRoutes.IP_INFO]: undefined;
  [AppRoutes.DATA]: undefined;
  [AppRoutes.HP_TQ_GRAPH]: undefined;
  [AppRoutes.SUSPENSION_GRAPH]: undefined;
  [AppRoutes.TIRE_TEMPS]: undefined;
  [AppRoutes.GRIP]: undefined;
  [AppRoutes.SOURCE_CHOOSER]: undefined;
  [AppRoutes.TUNING_CALCULATOR]: undefined;
  [AppRoutes.REPLAY_LIST]: ReplayRouteParams;
  [AppRoutes.SETTINGS]: undefined;
}

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
  REPLAY_LIST = 'replay_list',
  SETTINGS = 'settings',
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

export interface DataWindow<T> {
  size: number;
  min: number;
  max: number;
  data: T[];
  add: (data: T) => void;
  clear: () => void;
}

export function useDataWindow<T>(size: number,
  parseMin: (data: T) => number,
  parseMax: (data: T) => number,
  initialValues?: T[]): DataWindow<T> {
  const [data, setData] = useState<T[]>(initialValues ? initialValues : []);
  const [min, setMin] = useState(Number.MAX_SAFE_INTEGER);
  const [max, setMax] = useState(Number.MIN_SAFE_INTEGER);
  const add = (data: T) => {
    if (data) {
      const minValue = parseMin(data);
      const maxValue = parseMax(data);
      if (minValue < min) setMin(minValue);
      if (maxValue > max) setMax(maxValue);
    }
    setData((prev) => {
      if (prev.length >= size) {
        return [...prev.slice(1), data];
      }
      return [...prev, data];
    });
  };
  const clear = () => {
    setData([]);
  }

  return {
    size,
    min: min,
    max: max,
    data,
    add,
    clear,
  }
}


type NonFunctionProperties<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type ICache<T> = Pick<T, NonFunctionProperties<T>>;