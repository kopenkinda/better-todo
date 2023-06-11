import { Button } from "@chakra-ui/react";
import { IconTag } from "@tabler/icons-react";
import { ComponentProps } from "react";

export const ManageTags = (
  props: Omit<
    ComponentProps<typeof Button>,
    "onClick" | "size" | "aspectRatio" | "padding"
  >
) => {
  return (
    <Button size="sm" aspectRatio={1} padding={1} {...props}>
      <IconTag size={16} />
    </Button>
  );
};
