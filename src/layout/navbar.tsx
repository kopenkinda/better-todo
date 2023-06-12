import { Box, ButtonGroup } from "@chakra-ui/react";
import { AddTodo } from "../components/add-todo";
import { ThemeToggle } from "../components/theme-toggle";
import { AppDateSelector } from "../components/date-selector";
import { ManageTags } from "../components/manage-tags";
import useSwipe from "../hooks/use-swipe";
import { useTodos } from "../hooks/use-todos";
import { add, sub } from "date-fns";

export const AppNavbar = () => {
  const { setDate } = useTodos();
  const swipe = useSwipe({
    onSwipedLeft() {
      setDate((prev) => add(prev, { days: 1 }));
    },
    onSwipedRight() {
      setDate((prev) => sub(prev, { days: 1 }));
    },
  });
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
      {...swipe}
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
