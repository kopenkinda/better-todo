import { type ThemeConfig, extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "system",
  useSystemColorMode: false,
} satisfies ThemeConfig;

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
