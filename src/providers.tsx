import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";

export function AppProviders({ children }: { children: ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
