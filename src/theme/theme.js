// theme.js
import { colors } from "./colors";
export const lightTheme = {
  dark: false,
  colors: {
    primary: colors.white,
    background: colors.white,
    card: "#f8f9fa",
    text: "#000000",
    border: "#e0e0e0",
    notification: "#ff4757",
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: "#2980b9",
    background: "#121212",
    card: "#1c1c1c",
    text: "#ffffff",
    border: "#272727",
    notification: "#ff6b81",
  },
};
