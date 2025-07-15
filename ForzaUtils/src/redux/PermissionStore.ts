import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./AppStore";


export interface IPermissionState {
  isGranted: 'blocked' | 'granted';
}

const initialState: IPermissionState = {
  isGranted: 'blocked',
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissionState: (state, action: PayloadAction<IPermissionState>) => {
      state.isGranted = action.payload.isGranted;
    }
  },
  selectors: {
    getPermissionState: (permissions: IPermissionState) => permissions.isGranted,
  }
});
export const permissionReducer = permissionSlice.reducer;

export function usePermissionViewModel() {
  const dispatch = useDispatch();
  const permissionState = useAppSelector(permissionSlice.selectors.getPermissionState);
  return {
    permissionState,
    setPermissionState: (state: IPermissionState) => dispatch(permissionSlice.actions.setPermissionState(state))
  }
}