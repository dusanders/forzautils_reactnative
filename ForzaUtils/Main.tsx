import React from "react";
import App from "./App";
import { PermissionsWatcher } from "./src/context/Permissions";
import { NetworkWatcher } from "./src/context/Network";
import { CacheProvider } from "./src/context/Cache";
import { RecorderProvider } from "./src/context/Recorder";

function Main() {
  return (
    <CacheProvider>
      <PermissionsWatcher>
        <RecorderProvider>
          <NetworkWatcher>
            <App />
          </NetworkWatcher>
        </RecorderProvider>
      </PermissionsWatcher>
    </CacheProvider>
  )
}

export default Main;