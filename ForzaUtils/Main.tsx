import React from "react";
import { Provider } from "react-redux";
import { AppStore } from "./src/redux/AppStore";
import App from "./App";
import { PermissionsWatcher } from "./src/context/Permissions";
import { NetworkWatcher } from "./src/context/Network";
import { ViewModelStore_Hoc } from "./src/context/viewModels/ViewModelStore";
import { CacheProvider } from "./src/context/Cache";
import { RecorderProvider } from "./src/context/Recorder";

function Main() {
  return (
    <CacheProvider>
      <Provider store={AppStore}>
        <PermissionsWatcher>
          <RecorderProvider>
            <NetworkWatcher>
              <ViewModelStore_Hoc>
                <App />
              </ViewModelStore_Hoc>
            </NetworkWatcher>
          </RecorderProvider>
        </PermissionsWatcher>
      </Provider>
    </CacheProvider>
  )
}

export default Main;