import { atom, useAtomValue } from "jotai";


export interface IPermissionState {
  isGranted: 'blocked' | 'granted';
}
const initialState: IPermissionState = {
  isGranted: 'blocked',
};

export const permissionState = atom<IPermissionState>(initialState);
export const permissionAtom = atom((get) => get(permissionState).isGranted);
export const setPermissionAtom = atom(
  initialState,
  (get, set, newPermission: IPermissionState) => {
    const currentPermission = get(permissionState);
    set(permissionState, {
      ...currentPermission,
      isGranted: newPermission.isGranted,
    });
  }
);
export const useCurrentPermission = () => {
  return useAtomValue(permissionAtom);
}