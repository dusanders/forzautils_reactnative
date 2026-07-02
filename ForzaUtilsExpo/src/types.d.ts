declare module '*.png' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: import('react-native').ImageSourcePropType;
  export default value;
}

type NonFunctionProperties<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type ICache<T> = Pick<T, NonFunctionProperties<T>>;