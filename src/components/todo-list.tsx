import { Box, Stack, Text } from "@chakra-ui/react";
import { useTodos } from "../hooks/use-todos";
import { TodoItem } from "./todo-item";
import { AddTodo } from "./add-todo";

export function TodoList() {
  const { todos, globalTodos, forDate } = useTodos();
  const today = new Date();
  const when: "before" | "after" | "today" =
    today > forDate ? "before" : today < forDate ? "after" : "today";
  return (
    <Stack>
      {globalTodos.length > 0 && (
        <>
          <Text>Global</Text>
          {globalTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} global />
          ))}
          <Text>Daily</Text>
        </>
      )}
      {todos.length === 0 ? (
        <Box
          pt="24"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap=".5rem"
        >
          <Text>
            You {when === "before" ? "had" : "have"} nothing to do on{" "}
            {when === "today" ? "today" : forDate.toDateString()}
          </Text>
          <AddTodo withText />
        </Box>
      ) : (
        <>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} global={false} />
          ))}
        </>
      )}
    </Stack>
  );
}
