import { atom, useAtomValue, useSetAtom } from "jotai";


export interface IPermissionState {
  isGranted: 'blocked' | 'granted';
}
const initialState: IPermissionState = {
  isGranted: 'blocked',
};

const permissionState = atom<IPermissionState>(initialState);
const permissionAtom = atom((get) => get(permissionState).isGranted);
const setPermissionAtom = atom(
  initialState,
  (get, set, newPermission: IPermissionState) => {
    const currentPermission = get(permissionState);
    set(permissionState, {
      ...currentPermission,
      isGranted: newPermission.isGranted,
    });
  }
);

export function permissionService() {
  const permission = useAtomValue(permissionAtom);
  const setPermission = useSetAtom(setPermissionAtom);
  return {
    permission,
    setPermission: (newPermission: IPermissionState) => {
      setPermission(newPermission);
    },
  };
}