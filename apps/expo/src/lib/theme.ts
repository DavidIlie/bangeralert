import { DefaultTheme } from "@react-navigation/native";

//@ts-ignore
import tConfig from "@acme/tailwind-config";

export const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: tConfig.theme.extend.colors["dark-bg"],
    card: tConfig.theme.extend.colors["dark-containers"],
    text: "white",
  },
};
