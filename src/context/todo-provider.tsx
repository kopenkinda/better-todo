import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
  type Reducer,
  SetStateAction,
} from "react";
import { createId } from "@paralleldrive/cuid2";

import { todoSchema, type Todo } from "../schemas/todo-schema";
import { useTags } from "../hooks/use-tags";
import { type Tag } from "../schemas/tags-schema";
import { useLocalStorage } from "@mantine/hooks";

export type TodoAction =
  | { type: "ADD"; date: Date; data: Omit<Todo, "id"> }
  | {
      type: "EDIT";
      date: Date;
      data: Partial<Omit<Todo, "id">>;
      id: Todo["id"];
    }
  | { type: "TOGGLE"; date: Date; id: Todo["id"] }
  | { type: "REMOVE"; date: Date; id: Todo["id"] }
  | { type: "LOAD"; date: Date; tags: Tag[] };

export type TodoContext = {
  forDate: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  todos: Todo[];
  globalTodos: Todo[];
  actions: {
    add: (data: Omit<Todo, "id" | "isCompleted">, global?: boolean) => void;
    edit: (
      id: Todo["id"],
      data: Partial<Omit<Todo, "id">>,
      global?: boolean
    ) => void;
    toggle: (id: Todo["id"], global?: boolean) => void;
    remove: (id: Todo["id"], global?: boolean) => void;
  };
};

export const TodoContext = createContext<TodoContext | null>(null);

const keyFromDate = (date: Date) => `app-todos-${formatter.format(date)}`;
// const dateFromKey = (key: string) => new Date(key.slice("app-todos-".length));

const reducer: Reducer<Todo[], TodoAction> = (state, action) => {
  const result: Todo[] = state.length !== 0 ? structuredClone(state) : [];
  switch (action.type) {
    case "ADD": {
      result.push({
        id: createId(),
        ...action.data,
      });
      break;
    }
    case "EDIT": {
      const idx = result.findIndex((todo) => todo.id === action.id);
      const todo = result[idx];
      if (idx === -1 || !todo) {
        throw new Error(`Todo with id ${action.id} not found`);
      }
      result.splice(idx, 1, {
        ...todo,
        ...action.data,
      });
      break;
    }
    case "TOGGLE": {
      const idx = result.findIndex((todo) => todo.id === action.id);
      const todo = result[idx];
      if (idx === -1 || !todo) {
        throw new Error(`Todo with id ${action.id} not found`);
      }
      result.splice(idx, 1, {
        ...todo,
        isCompleted: !todo.isCompleted,
      });
      break;
    }
    case "REMOVE": {
      const idx = result.findIndex((todo) => todo.id === action.id);
      if (idx === -1) {
        throw new Error(`Todo with id ${action.id} not found`);
      }
      result.splice(idx, 1);
      break;
    }
    case "LOAD": {
      result.length = 0;
      const key = keyFromDate(action.date);
      const data = localStorage.getItem(key);
      if (data === undefined || data === null) {
        break;
      }
      try {
        const todos = JSON.parse(data);
        if (!Array.isArray(todos)) {
          throw new Error(`Invalid data: ${data}`);
        }
        for (const rawTodo of todos) {
          const todo = todoSchema.safeParse(rawTodo);
          if (!todo.success) {
            continue;
          }
          if (!action.tags.map((t) => t.id).includes(todo.data.tag ?? "")) {
            todo.data.tag = "_NONE";
          }
          result.push(todo.data);
        }
      } catch (err) {
        localStorage.removeItem(key);
        result.length = 0;
        console.error(err);
      }
      return result;
    }
    default: {
      const _unreachable: never = action;
      throw new Error(
        `Unhandled action: ${JSON.stringify(_unreachable, null, 2)}`
      );
    }
  }
  const key = keyFromDate(action.date);
  localStorage.setItem(key, JSON.stringify(result));
  return result;
};

const formatter = new Intl.DateTimeFormat("ru", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [forDate, setDate] = useState(new Date());
  const [todos, dispatch] = useReducer(reducer, []);
  const [globalTodos, setGlobalTodos] = useLocalStorage<Todo[]>({
    key: "app-global-todos",
    defaultValue: [],
  });
  const { tags } = useTags();
  const actions = useMemo<TodoContext["actions"]>(
    () => ({
      add(data, global = false) {
        if (global) {
          setGlobalTodos((prev) => [
            ...prev,
            {
              id: createId(),
              ...data,
              isCompleted: false,
              createdAt: new Date(),
            },
          ]);
          return;
        } else {
          dispatch({
            type: "ADD",
            date: forDate,
            data: { ...data, isCompleted: false },
          });
        }
      },
      edit(id, data, global = false) {
        if (global) {
          setGlobalTodos((prev) => {
            const idx = prev.findIndex((todo) => todo.id === id);
            if (idx === -1) {
              throw new Error(`Todo with id ${id} not found`);
            }
            const todo = prev[idx];
            const newTodo = {
              ...todo,
              ...data,
            };
            newTodo.finishedAt = newTodo.isCompleted ? new Date() : undefined;
            return [...prev.slice(0, idx), newTodo, ...prev.slice(idx + 1)];
          });
        } else {
          dispatch({ type: "EDIT", date: forDate, data, id });
        }
      },
      toggle(id, global = false) {
        if (global) {
          setGlobalTodos((prev) => {
            const idx = prev.findIndex((todo) => todo.id === id);
            if (idx === -1) {
              throw new Error(`Todo with id ${id} not found`);
            }
            const todo = prev[idx];
            return [
              ...prev.slice(0, idx),
              {
                ...todo,
                isCompleted: !todo.isCompleted,
                finishedAt: !todo.isCompleted ? new Date() : undefined,
              },
              ...prev.slice(idx + 1),
            ];
          });
          return;
        } else {
          dispatch({ type: "TOGGLE", date: forDate, id });
        }
      },
      remove(id, global = false) {
        if (global) {
          setGlobalTodos((prev) => prev.filter((todo) => todo.id !== id));
        } else {
          dispatch({ type: "REMOVE", date: forDate, id });
        }
      },
    }),
    [forDate, setGlobalTodos]
  );
  useEffect(() => {
    dispatch({ type: "LOAD", date: forDate, tags });
  }, [forDate, tags]);
  const filteredGlobalTodos = useMemo(() => {
    return globalTodos.filter((todo) => {
      if (!todo.finishedAt || !todo.createdAt) {
        return true;
      }
      const finishedAt = new Date(todo.finishedAt);
      const createdAt = new Date(todo.createdAt);
      finishedAt.setHours(23, 59, 59, 999);
      createdAt.setHours(0, 0, 0, 0);
      return (
        forDate.getTime() >= createdAt.getTime() &&
        forDate.getTime() <= finishedAt.getTime()
      );
    });
  }, [globalTodos, forDate]);
  return (
    <TodoContext.Provider
      value={{
        todos,
        actions,
        globalTodos: filteredGlobalTodos,
        forDate,
        setDate,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
