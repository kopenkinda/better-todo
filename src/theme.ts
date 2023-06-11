import { type ThemeConfig, extendTheme } from "@chakra-ui/react";
import { CalendarDefaultTheme } from "@uselessdev/datepicker";

const config = {
  initialColorMode: "system",
  useSystemColorMode: false,
} satisfies ThemeConfig;

// 3. extend the theme
const theme = extendTheme(
  {
    config,
  },
  CalendarDefaultTheme
);

export default theme;
