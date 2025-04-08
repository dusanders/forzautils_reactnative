import React from "react";
import { Provider } from "react-redux";
import { AppStore } from "./src/redux/AppStore";
import App from "./App";
import { PermissionsWatcher } from "./src/context/Permissions";
import { NetworkWatcher } from "./src/context/Network";

function Main() {
  return (
    <Provider store={AppStore}>
      <PermissionsWatcher>
        <NetworkWatcher>
          <App />
        </NetworkWatcher>
      </PermissionsWatcher>
    </Provider>
  )
}

export default Main;