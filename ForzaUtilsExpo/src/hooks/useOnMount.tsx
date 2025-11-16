import React from "react";

export function useOnMount(effect: React.EffectCallback) {
  React.useEffect(() => {
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}