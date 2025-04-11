import React from "react";
import { Provider } from "react-redux";
import { AppStore } from "./src/redux/AppStore";
import App from "./App";
import { PermissionsWatcher } from "./src/context/Permissions";
import { NetworkWatcher } from "./src/context/Network";
import { ViewModelStore_Hoc } from "./src/context/viewModels/ViewModelStore";

function Main() {
  return (
    <Provider store={AppStore}>
      <PermissionsWatcher>
        <NetworkWatcher>
          <ViewModelStore_Hoc>
            <App />
          </ViewModelStore_Hoc>
        </NetworkWatcher>
      </PermissionsWatcher>
    </Provider>
  )
}

export default Main;