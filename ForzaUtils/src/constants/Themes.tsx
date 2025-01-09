import React from "react";

export interface IThemeElements {
  colors: {
    text: {
      primary: {
        onPrimary: string;
        onSecondary: string;
      }
      secondary: {
        onPrimary: string;
        onSecondary: string;
      }
      warning: {
        onPrimary: string;
        onSecondary: string;
      }
      error: {
        onPrimary: string;
        onSecondary: string;
      }
    };
    background: {
      primary: string;
      onPrimary: string;
      secondary: string;
      onSecondary: string;
    };
    card: {
      borderColor: string;
    };
  }
  sizes: {
    font: {
      small: number;
      medium: number;
      large: number;
    }
    paper: {
      padding: number;
      spacingY: number;
      spacingX: number;
    }
    button: {
      elevation: number;
      padding: number;
      margin: number;
      size: number;
    }
    icon: number,
    navBar: number,
    borderRadius: number;
  }
}
export type TextVariantType = keyof IThemeElements['colors']['text'];
export type TextOnBackgroundVariant = 'onPrimary' | 'onSecondary';
export type BackgroundVariantType = keyof IThemeElements['colors']['background'];

const defaultPaper: IThemeElements['sizes']['paper'] = {
  padding: 20,
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
  size: 75
}

export const LighColors: IThemeElements = {
  colors: {
    text: {
      primary: {
        onPrimary: "rgba(33,33,33,1)",
        onSecondary: 'rgba(243,254, 243,1)'
      },
      secondary: {
        onPrimary: "rgba(242,242,242,1)",
        onSecondary: 'rgba(242,242,242,1)'
      },
      warning: {
        onPrimary: 'rgb(225, 158, 1)',
        onSecondary: 'rgb(255,158,1)'
      },
      error: {
        onPrimary: "rgb(162, 0, 0)",
        onSecondary: 'rgb(162, 0, 0)'
      }
    },
    background: {
      primary: 'rgb(255, 255, 255)',
      onPrimary: 'rgb(242,242,242)',
      secondary: 'rgb(34,40,44)',
      onSecondary: 'rgb(57,61,65)'
    },
    card: {
      borderColor: 'rgb(223,218,220)'
    },
  },
  sizes: {
    icon: 25,
    navBar: 50,
    borderRadius: 12,
    font: defaultFont,
    paper: defaultPaper,
    button: defaultButton
  }
}
export const DarkColors: IThemeElements = {
  colors: {
    text: {
      primary: {
        onPrimary: "rgba(253,251,249,1)",
        onSecondary: 'rgba(0,0,0,1)'
      },
      secondary: {
        onPrimary: "rgba(120,120,120,1)",
        onSecondary: 'rgba(120,120,120,1)'
      },
      warning: {
        onPrimary: 'rgb(225, 158, 1)',
        onSecondary: 'rgba(255,158,1)'
      },
      error: {
        onPrimary: "rgb(245, 58, 58)",
        onSecondary: 'rgb(132, 0, 0)'
      }
    },
    background: {
      primary: 'rgb(34, 40, 44)',
      onPrimary: 'rgb(57,61,65)',
      secondary: 'rgb(253, 243, 255)',
      onSecondary: 'rgba(220, 220, 220,1)'
    },
    card: {
      borderColor: 'rgb(52,58,62)'
    },
  },
  sizes: {
    icon: 25,
    navBar: 50,
    borderRadius: 12,
    font: defaultFont,
    paper: defaultPaper,
    button: defaultButton
  }
}