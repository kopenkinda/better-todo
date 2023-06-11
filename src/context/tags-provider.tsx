import { useLocalStorage } from "@mantine/hooks";
import { createContext } from "react";
import { type Tag } from "../schemas/tags-schema";

type TagsContextType = {
  tags: Tag[];
  add: (tag: Tag) => void;
  remove: (id: Tag["name"]) => void;
  edit: (id: Tag["name"], data: Partial<Tag>) => void;
};

export const TagsContext = createContext<null | TagsContextType>(null);

export const TagsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tags, setTags] = useLocalStorage<Tag[]>({
    key: "app-tags",
    defaultValue: [],
  });
  const value: TagsContextType = {
    tags,
    add(tag) {
      setTags((current) => [...current, tag]);
    },
    remove(name) {
      setTags((current) => current.filter((tag) => tag.name !== name));
    },
    edit(id, data) {
      setTags((current) => {
        const idx = current.findIndex((tag) => tag.name === id);
        const tag = current[idx];
        if (idx === -1 || !tag) {
          throw new Error(`Tag with id ${id} not found`);
        }
        return [
          ...current.slice(0, idx),
          {
            ...tag,
            ...data,
          },
          ...current.slice(idx + 1),
        ];
      });
    },
  };
  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
};
