import { Dimensions } from "react-native";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function percentOfDeviceHeight(percent: number) {
  const { height } = Dimensions.get('window');
  return (percent / 100) * height;
}

export function percentOfDeviceWidth(percent: number) {
  const { width } = Dimensions.get('window');
  return (percent / 100) * width;
}