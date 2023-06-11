import { useContext } from "react";
import { TagsContext } from "../context/tags-provider";

export const useTags = () => useContext(TagsContext);
