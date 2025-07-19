import { StyleSheet } from "react-native";

export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
  FOREST = 'forest',
  CLAUDES = 'claudes'
}

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
      dialogBackdrop: string;
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

export const LightColors: IThemeElements = {
  colors: {
    text: {
      primary: {
        onPrimary: "rgba(33,33,33,1)",
        onSecondary: 'rgba(243,254, 243,1)'
      },
      secondary: {
        onPrimary: "rgb(124, 131, 145)",
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
      onSecondary: 'rgb(131, 140, 149)',
      dialogBackdrop: 'rgba(0,0,0,0.33)'
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
      onSecondary: 'rgba(220, 220, 220,1)',
      dialogBackdrop: 'rgba(255,255,255,0.33)'
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
export const ForestTheme: IThemeElements = {
  colors: {
    text: {
      primary: {
      onPrimary: "rgba(220, 226, 213, 1)",
      onSecondary: 'rgba(33, 26, 20, 1)'
      },
      secondary: {
      onPrimary: "rgba(142, 151, 122, 1)",
      onSecondary: 'rgba(80, 73, 60, 1)'
      },
      warning: {
      onPrimary: 'rgb(171, 115, 51)',
      onSecondary: 'rgb(201, 145, 81)'
      },
      error: {
      onPrimary: "rgb(145, 40, 33)",
      onSecondary: 'rgb(115, 20, 13)'
      }
    },
    background: {
      primary: 'rgb(29, 36, 27)',
      onPrimary: 'rgb(40, 48, 36)',
      secondary: 'rgb(209, 200, 180)',
      onSecondary: 'rgb(175, 165, 145)',
      dialogBackdrop: 'rgba(15, 20, 10, 0.75)'
    },
    card: {
      borderColor: 'rgb(54, 66, 48)'
    },
    },
    sizes: {
    icon: 25,
    navBar: 50,
    borderRadius: 8,
    font: defaultFont,
    paper: defaultPaper,
    button: defaultButton
    }
}
export const ClaudesTheme: IThemeElements = {
  colors: {
    text: {
      primary: {
        onPrimary: "rgba(180, 180, 190, 1)",
        onSecondary: 'rgba(60, 60, 70, 1)'
      },
      secondary: {
        onPrimary: "rgba(120, 120, 130, 1)",
        onSecondary: 'rgba(90, 90, 100, 1)'
      },
      warning: {
        onPrimary: 'rgb(130, 110, 80)',
        onSecondary: 'rgb(150, 130, 90)'
      },
      error: {
        onPrimary: "rgb(130, 90, 90)",
        onSecondary: 'rgb(100, 70, 70)'
      }
    },
    background: {
      primary: 'rgb(25, 25, 30)',
      onPrimary: 'rgb(35, 35, 40)',
      secondary: 'rgb(50, 50, 60)',
      onSecondary: 'rgb(70, 70, 80)',
      dialogBackdrop: 'rgba(15, 15, 20, 0.8)'
    },
    card: {
      borderColor: 'rgb(45, 45, 50)'
    },
  },
  sizes: {
    icon: 25,
    navBar: 50,
    borderRadius: 4,
    font: defaultFont,
    paper: defaultPaper,
    button: {
      ...defaultButton,
      elevation: 1,
      padding: 18
    }
  }
}

export const GlobalStyles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})