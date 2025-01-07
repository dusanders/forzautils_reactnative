import React from "react";

export interface IThemeElements {
  colors: {
    text: {
      primary: string;
      secondary: string;
      warning: string;
      error: string;
    };
    background: {
      primary: string;
      onPrimary: string;
      secondary: string;
      onSecondary: string;
    };
    card: {
      borderColor: string;
    }
  }
  sizes: {
    font: {
      small: number;
      medium: number;
      large: number;
    }
    paper: {
      padding: number;
      borderRadius: number;
      spacingY: number;
      spacingX: number;
    }
    button: {
      elevation: number;
      padding: number;
      margin: number;
      borderRadius: number;
      size: number;
    }
    icon: number,
    navBar: number
  }
}

const defaultPaper: IThemeElements['sizes']['paper'] = {
  padding: 20,
  borderRadius: 12,
  spacingX: 0,
  spacingY: 0
}

const defaultFont: IThemeElements['sizes']['font'] = {
  small: 12,
  medium: 14,
  large: 18
}

const defaultButton: IThemeElements['sizes']['button'] = {
  padding: 20,
  elevation: 0,
  margin: 10,
  borderRadius: 12,
  size: 75
}

export const LighColors: IThemeElements = {
  colors: {
    text: {
      primary: "rgba(33,33,33,1)",
      secondary: "rgba(100,100,100,1)",
      warning: 'rgb(225, 158, 1)',
      error: "rgb(162, 0, 0)"
    },
    background: {
      primary: 'rgb(207, 207, 207)',
      onPrimary: 'rgb(181, 180, 180)',
      secondary: 'rgb(125, 144, 252)',
      onSecondary: 'rgb(245, 199, 199)'
    },
    card: {
      borderColor: 'rgb(52,58,62)'
    }
  },
  sizes: {
    icon: 20,
    navBar: 70,
    font: defaultFont,
    paper: defaultPaper,
    button: defaultButton
  }
}
export const DarkColors: IThemeElements = {
  colors: {
    text: {
      primary: "rgba(253,251,249,1)",
      secondary: "rgba(150,150,150,1)",
      warning: 'rgb(225, 158, 1)',
      error: "rgb(162, 0, 0)"
    },
    background: {
      primary: 'rgb(34, 40, 44)',
      onPrimary: 'rgb(52,58,62)',
      secondary: 'rgb(64, 36, 110)',
      onSecondary: 'rgba(0, 0, 0, 0)'
    },
    card: {
      borderColor: 'rgb(52,58,62)'
    }
  },
  sizes: {
    icon: 20,
    navBar: 70,
    font: defaultFont,
    paper: defaultPaper,
    button: defaultButton
  }
}