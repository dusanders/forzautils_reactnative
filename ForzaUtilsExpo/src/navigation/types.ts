import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum AppRoutes {
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  NOT_FOUND = 'NOT_FOUND',
  IP_INFO = 'IP_INFO',
  DATA = 'DATA',
  HP_TQ_GRAPH = 'HP_TQ_GRAPH',
  SUSPENSION_GRAPH = 'SUSPENSION_GRAPH',
  TIRE_TEMPS = 'TIRE_TEMPS',
  GRIP = 'GRIP',
  SOURCE_CHOOSER = 'SOURCE_CHOOSER',
  TUNING_CALCULATOR = 'TUNING_CALCULATOR',
  REPLAY_LIST = 'REPLAY_LIST',
  SETTINGS = 'SETTINGS',
}

export type ReplayRouteParams = {
  listId: string;
};

export type RootStackParamList = {
  [AppRoutes.HOME]: undefined;
  [AppRoutes.EXPLORE]: undefined;
  [AppRoutes.NOT_FOUND]: undefined;
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
};

export type MainAppNavigation = NativeStackNavigationProp<RootStackParamList>;

export const MainStack = createNativeStackNavigator<RootStackParamList>();