import { Stack } from "@chakra-ui/react";
import { useTodos } from "../hooks/use-todos";
import { TodoItem } from "./todo-item";

export function TodoList() {
  const { todos } = useTodos();
  return (
    <Stack>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </Stack>
  );
}
