import {
  type Dispatch,
  type ReactNode,
  type Reducer,
  createContext,
  useReducer,
  useState,
  useMemo,
  useEffect,
} from "react";

import { createId } from "@paralleldrive/cuid2";

export type Todo = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  tags: string[];
};

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
  | { type: "LOAD"; date: Date };

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
        for (const todo of todos) {
          if (typeof todo !== "object" || todo === null) {
            throw new Error(`Invalid data: ${data}`);
          }
          if (
            !("id" in todo) ||
            !("title" in todo) ||
            !("description" in todo) ||
            !("isCompleted" in todo) ||
            !("tags" in todo)
          ) {
            throw new Error(`Invalid data: ${data}`);
          }
          const { description, id, isCompleted, tags, title } = todo;
          if (
            typeof id !== "string" ||
            typeof title !== "string" ||
            typeof description !== "string" ||
            typeof isCompleted !== "boolean" ||
            !Array.isArray(tags)
          ) {
            throw new Error(`Invalid data: ${data}`);
          }
          const correctTags = tags.filter(
            (tag) => typeof tag === "string"
          ) as string[];
          result.push({
            isCompleted,
            id,
            title,
            description,
            tags: correctTags,
          });
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
    dispatch({ type: "LOAD", date: forDate });
  }, [forDate]);
  return (
    <TodoContext.Provider value={{ todos, actions, forDate, setDate }}>
      {children}
    </TodoContext.Provider>
  );
};
