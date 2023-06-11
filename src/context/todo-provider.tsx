import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
  type Reducer,
} from "react";
import { createId } from "@paralleldrive/cuid2";

import { todoSchema, type Todo } from "../schemas/todo-schema";
import { useTags } from "../hooks/use-tags";
import { type Tag } from "../schemas/tags-schema";

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
  setDate: Dispatch<Date>;
  todos: Todo[];
  actions: {
    add: (data: Omit<Todo, "id" | "isCompleted">) => void;
    edit: (id: Todo["id"], data: Partial<Omit<Todo, "id">>) => void;
    toggle: (id: Todo["id"]) => void;
    remove: (id: Todo["id"]) => void;
  };
};

export const TodoContext = createContext<TodoContext | null>(null);

const keyFromDate = (date: Date) => `app-todos-${formatter.format(date)}`;
// const dateFromKey = (key: string) => new Date(key.slice("app-todos-".length));

const reducer: Reducer<Todo[], TodoAction> = (state, action) => {
  const result = state.length !== 0 ? structuredClone(state) : [];
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
            todo.data.tag = undefined;
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
  const { tags } = useTags();
  const actions = useMemo<TodoContext["actions"]>(
    () => ({
      add(data) {
        dispatch({
          type: "ADD",
          date: forDate,
          data: { ...data, isCompleted: false },
        });
      },
      edit(id, data) {
        dispatch({ type: "EDIT", date: forDate, data, id });
      },
      toggle(id) {
        dispatch({ type: "TOGGLE", date: forDate, id });
      },
      remove(id) {
        dispatch({ type: "REMOVE", date: forDate, id });
      },
    }),
    [forDate]
  );
  useEffect(() => {
    dispatch({ type: "LOAD", date: forDate, tags });
  }, [forDate, tags]);
  return (
    <TodoContext.Provider value={{ todos, actions, forDate, setDate }}>
      {children}
    </TodoContext.Provider>
  );
};
