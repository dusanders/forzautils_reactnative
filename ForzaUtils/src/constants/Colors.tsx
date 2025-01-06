import React from "react";

export interface IColorDefinitions {
  text: {
    primary: string;
    secondary: string;
    error: string;
  };
  navBtnBackground: string;
  background: string;

}

export const DarkColors: IColorDefinitions = {
  text: {
    primary: "rgba(220,220,220,1)",
    secondary: "",
    error: ""
  },
  background: "rgba(33,33,33,1)",
  navBtnBackground: 'rgba(100, 100, 100, 1)'
}