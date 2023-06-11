import { TodoList } from "./components/todo-list";
import { AppNavbar } from "./layout/navbar";
import { AppProviders } from "./providers";

function App() {
  return (
    <AppProviders>
      <AppNavbar />
      <TodoList />
    </AppProviders>
  );
}

export default App;
