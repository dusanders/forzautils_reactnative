import { IThemeElements } from "../src/constants/Themes"

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

export const mockLighColors: IThemeElements = {
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
export const mockDarkColors: IThemeElements = {
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