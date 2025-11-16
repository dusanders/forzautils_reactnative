import { useThemeContext } from "@/theme/ThemeProvider";
import { IThemeElements } from "@/theme/Themes";

export function invokeWithTheme<T>(callback: (theme: IThemeElements) => T): T {
  const theme = useThemeContext().theme;
  return callback(theme);
}