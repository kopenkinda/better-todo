import { ReactNode } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import { TodoProvider } from "./context/todo-provider";
import { TagsProvider } from "./context/tags-provider";

export function AppProviders({ children }: { children?: ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <TagsProvider>
        <TodoProvider>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          {children}
        </TodoProvider>
      </TagsProvider>
    </ChakraProvider>
  );
}
