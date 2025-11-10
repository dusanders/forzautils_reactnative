import React from "react";
import { AppBarContainer } from "../../components/AppBar/AppBarContainer";
import { AvgTireTemps } from "../../components/Graphs/AvgTireTemp";

export interface TireTempsProps {
  // Nothing
}

export function TireTemps(props: TireTempsProps) {

  return (
    <AppBarContainer
      title="Tire Temps">
        <AvgTireTemps key={'avgTireTemps'} />
    </AppBarContainer>
  )
}
