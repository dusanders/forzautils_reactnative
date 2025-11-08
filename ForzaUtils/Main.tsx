import React from "react";
import App from "./App";
import { PermissionsWatcher } from "./src/context/Permissions";
import { NetworkWatcher } from "./src/context/Network";
import { ViewModelStore_Hoc } from "./src/context/viewModels/ViewModelStore";
import { CacheProvider } from "./src/context/Cache";
import { RecorderProvider } from "./src/context/Recorder";
import { Provider } from "react-redux";
import { AppStore } from "./src/redux/AppStore";
import { WifiProvider } from "./src/context/Wifi";

function Main() {
  return (
    <Provider store={AppStore}>
      <WifiProvider>
        <CacheProvider>
          <PermissionsWatcher>
            <RecorderProvider>
              <NetworkWatcher>
                <ViewModelStore_Hoc>
                  <App />
                </ViewModelStore_Hoc>
              </NetworkWatcher>
            </RecorderProvider>
          </PermissionsWatcher>
        </CacheProvider>
      </WifiProvider>
    </Provider>
  )
}

export default Main;