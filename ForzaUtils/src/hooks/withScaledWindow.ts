import React, { ReactElement, useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

export interface IScaledWindow {
  widthFactor: number;
  heightFactor: number;
  width: number;
  height: number;
}

/**
 * Scales the 'window' measures by decimal factors to return a 
 * percentage of the full measures
 * @param widthFactor Decimal factor to multiply width
 * @param heightFactor Decimal factor to multiple height
 * @returns 
 */
export function withScaledWindow(widthFactor: number, heightFactor: number): IScaledWindow {
  const getScaledWidth = (window: ScaledSize) => {
    const measure = window.width > window.height
      ? window.width - 100
      : window.width;
    return measure * widthFactor;
  }
  const getScaledHeight = (window: ScaledSize) => {
    const measure = window.height < window.width
      ? window.height
      : window.height;
    return measure * heightFactor
  }
  
  const [width, setWidth] = useState(
    getScaledWidth(Dimensions.get('window'))
  );
  const [height, setHeight] = useState(
    getScaledHeight(Dimensions.get('window'))
  );

  useEffect(() => {
    const handleOrientation = Dimensions.addEventListener('change',
      (ev: { window: ScaledSize, screen: ScaledSize }) => {
        setWidth(
          getScaledWidth(ev.window)
        );
        setHeight(
          getScaledHeight(ev.window)
        )
      }
    );
    return () => {
      handleOrientation.remove();
    }
  }, []);

  return {
    widthFactor: widthFactor,
    heightFactor: heightFactor,
    height: height,
    width: width
  }
}