import { useContext } from "react";
import { TagsContext } from "../context/tags-provider";

export const useTags = () => {
  const v = useContext(TagsContext);
  if (v === null) {
    throw new Error("useTags must be used within a TagsProvider");
  }
  return v;
};
