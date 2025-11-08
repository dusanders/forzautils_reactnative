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
        onPrimary: "rgba(240, 235, 220, 1)", // Moonlight through canopy
        onSecondary: 'rgba(45, 35, 25, 1)' // Rich dark earth
      },
      secondary: {
        onPrimary: "rgba(156, 139, 102, 1)", // Aged moss green
        onSecondary: 'rgba(101, 67, 33, 1)' // Deep bark brown
      },
      warning: {
        onPrimary: 'rgb(191, 144, 73)', // Autumn leaf gold
        onSecondary: 'rgb(218, 165, 32)' // Golden rod
      },
      error: {
        onPrimary: "rgb(139, 69, 19)", // Rustic red-brown
        onSecondary: 'rgb(160, 82, 45)' // Saddle brown
      }
    },
    background: {
      primary: 'rgb(25, 35, 20)', // Deep forest floor
      onPrimary: 'rgb(35, 50, 28)', // Shadowed undergrowth
      secondary: 'rgb(139, 121, 94)', // Rich loamy soil
      onSecondary: 'rgb(160, 134, 96)', // Lighter earth tone
      dialogBackdrop: 'rgba(20, 30, 15, 0.85)' // Dense canopy shadow
    },
    card: {
      borderColor: 'rgb(76, 111, 58)' // Pine needle green
    },
  },
  sizes: {
    icon: 25,
    navBar: 50,
    borderRadius: 6, // More natural, organic edges
    font: defaultFont,
    paper: defaultPaper,
    button: defaultButton
  }
}
export const ClaudesTheme: IThemeElements = {
  colors: {
    text: {
      primary: {
        onPrimary: "rgba(255, 250, 235, 1)", // Warm sand white
        onSecondary: 'rgba(20, 30, 40, 1)' // Deep ocean blue
      },
      secondary: {
        onPrimary: "rgba(184, 134, 11, 1)", // Golden sunset
        onSecondary: 'rgba(139, 69, 19, 1)' // Driftwood brown
      },
      warning: {
        onPrimary: 'rgb(255, 140, 0)', // Tropical orange
        onSecondary: 'rgb(255, 165, 0)' // Bright sunset orange
      },
      error: {
        onPrimary: "rgb(220, 20, 60)", // Coral red
        onSecondary: 'rgb(178, 34, 34)' // Deep coral
      }
    },
    background: {
      primary: 'rgb(0, 128, 128)', // Teal water
      onPrimary: 'rgb(32, 178, 170)', // Lighter teal
      secondary: 'rgb(245, 222, 179)', // Sandy beige
      onSecondary: 'rgb(210, 180, 140)', // Tan sand
      dialogBackdrop: 'rgba(0, 105, 105, 0.75)' // Dark teal overlay
    },
    card: {
      borderColor: 'rgb(72, 209, 204)' // Medium sea green
    },
  },
  sizes: {
    icon: 25,
    navBar: 50,
    borderRadius: 16, // Smoother, more organic feel
    font: defaultFont,
    paper: defaultPaper,
    button: defaultButton
  }
}

export const GlobalStyles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})