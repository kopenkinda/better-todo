import { useLocalStorage } from "@mantine/hooks";
import { createContext } from "react";
import { type Tag } from "../schemas/tags-schema";
import { createId } from "@paralleldrive/cuid2";

type TagsContextType = {
  tags: Tag[];
  add: (tag: Omit<Tag, "id">) => void;
  remove: (id: Tag["id"]) => void;
  edit: (id: Tag["id"], data: Omit<Partial<Tag>, "id">) => void;
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
      if (tags.find((t) => t.name === tag.name)) {
        return;
      }
      setTags((current) => [...current, { ...tag, id: createId() }]);
    },
    remove(id) {
      setTags((current) => current.filter((tag) => tag.id !== id));
    },
    edit(id, data) {
      setTags((current) => {
        const idx = current.findIndex((tag) => tag.id === id);
        const tag = current[idx];
        if (idx === -1 || !tag) {
          throw new Error(`Tag with id ${id} not found`);
        }
        return current.map((tag) => {
          if (tag.id !== id) {
            return tag;
          }
          return {
            ...tag,
            ...data,
          };
        });
      });
    },
  };
  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
};
