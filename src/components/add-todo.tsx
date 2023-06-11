import { Button } from "@chakra-ui/react";
import { IconPlus } from "@tabler/icons-react";
import { useState, type ComponentProps } from "react";
import { TodoModal } from "./todo-modal";

export function AddTodo({
  withText = false,
  ...props
}: Omit<
  ComponentProps<typeof Button>,
  "onClick" | "size" | "aspectRatio" | "padding" | "colorScheme" | "isLoading"
> & { withText?: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        size="sm"
        aspectRatio={withText ? undefined : 1}
        padding={withText ? undefined : 1}
        colorScheme="green"
        isLoading={modalOpen}
        {...props}
      >
        {withText && "Add Todo"}
        <IconPlus size={16} />
      </Button>
      <TodoModal
        mode="add"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
