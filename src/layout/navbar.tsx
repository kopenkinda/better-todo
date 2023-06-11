import { Box, ButtonGroup } from "@chakra-ui/react";
import { AddTodo } from "../components/add-todo";
import { ThemeToggle } from "../components/theme-toggle";
import { AppDateSelector } from "../components/date-selector";
import { ManageTags } from "../components/manage-tags";

export const AppNavbar = () => {
  return (
    <Box
      position="sticky"
      top="0"
      left="0"
      right="0"
      p="2"
      borderBottom="1px solid rgba(0, 0, 0, 0.2)"
      display="grid"
      gridTemplateColumns="20% 1fr 20%"
      alignItems="center"
      bg="chakra-body-bg"
      zIndex="1"
    >
      <Box display="flex" justifyContent="flex-start">
        <ButtonGroup isAttached>
          <ThemeToggle />
          <ManageTags />
        </ButtonGroup>
      </Box>
      <Box display="flex" justifyContent="center">
        <AppDateSelector />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <AddTodo />
      </Box>
    </Box>
  );
};
