import { Button, useColorMode } from "@chakra-ui/react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { ComponentProps } from "react";

export function ThemeToggle(
  props: Omit<
    ComponentProps<typeof Button>,
    "onClick" | "size" | "aspectRatio" | "padding"
  >
) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      onClick={toggleColorMode}
      size="sm"
      aspectRatio={1}
      padding={1}
      {...props}
    >
      {colorMode === "dark" ? <IconSun size={16} /> : <IconMoon size={16} />}
    </Button>
  );
}
