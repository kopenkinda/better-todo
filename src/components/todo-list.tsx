import { Stack } from "@chakra-ui/react";
import { useTodos } from "../hooks/use-todos";

export function TodoList() {
  const { todos } = useTodos();
  return (
    <Stack>
      {todos.map((todo) => (
        <div key={todo.id}>
          <h3>{todo.title}</h3>
        </div>
      ))}
    </Stack>
  );
}
