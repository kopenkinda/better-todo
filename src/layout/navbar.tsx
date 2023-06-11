import { Box } from "@chakra-ui/react";
import { ThemeToggle } from "../components/theme-toggle";
import { AddTodo } from "../components/add-todo";

export const AppNavbar = () => {
  return (
    <Box
      position="sticky"
      top="0"
      left="0"
      right="0"
      p="2"
      borderBottom="1px solid rgba(0, 0, 0, 0.2)"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <ThemeToggle />
      <h1>Calendar Here</h1>
      <AddTodo />
    </Box>
  );
};
