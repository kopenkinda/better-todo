import { Box } from "@chakra-ui/react";
import { TodoList } from "./components/todo-list";
import { AppNavbar } from "./layout/navbar";
import { AppProviders } from "./providers";

function App() {
  return (
    <AppProviders>
      <AppNavbar />
      <Box p="2">
        <TodoList />
      </Box>
    </AppProviders>
  );
}

export default App;
