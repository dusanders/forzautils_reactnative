import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";


export interface IPermissionState {
  isGranted: 'blocked' | 'granted';
}

const initialState: IPermissionState = {
  isGranted: 'blocked',
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissionState: (state, action: PayloadAction<IPermissionState>) => {
      state.isGranted = action.payload.isGranted;
    }
  }
});
export const { setPermissionState } = permissionSlice.actions;
export const permissionReducer = permissionSlice.reducer;
export const useSetPermissionState = () => {
  const dispatch = useDispatch();
  return (state: IPermissionState) => dispatch(setPermissionState(state));
}