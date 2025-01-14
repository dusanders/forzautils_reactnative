import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type StateHandler<T> = (prev: T, next: Partial<T>) => T;

export type RootStackParamList = Record<AppRoutes, undefined>;
export type StackNavigation = NativeStackNavigationProp<RootStackParamList>;

export enum AppRoutes {
  SPLASH = 'splash',
  IP_INFO = 'ip_info',
  DATA = 'data',
  HP_TQ_GRAPH = 'hp_tq_graph',
  SUSPENSION_GRAPH = 'suspension_graph',
  TIRE_TEMPS = 'tire_temps',
  GRIP = 'grip'
}
export function delay(delay: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  })
}
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