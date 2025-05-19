import React from "react";
import App from "./App";
import { PermissionsWatcher } from "./src/context/Permissions";
import { NetworkWatcher } from "./src/context/Network";
import { ViewModelStore_Hoc } from "./src/context/viewModels/ViewModelStore";
import { CacheProvider } from "./src/context/Cache";
import { RecorderProvider } from "./src/context/Recorder";

function Main() {
  return (
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
  )
}

export default Main;