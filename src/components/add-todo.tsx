import { Button } from "@chakra-ui/react";
import { IconPlus } from "@tabler/icons-react";
import { useState, type ComponentProps } from "react";
import { TodoModal } from "./todo-modal";

export function AddTodo(
  props: Omit<
    ComponentProps<typeof Button>,
    "onClick" | "size" | "aspectRatio" | "padding" | "colorScheme" | "isLoading"
  >
) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        size="sm"
        aspectRatio={1}
        padding={1}
        colorScheme="green"
        isLoading={modalOpen}
        {...props}
      >
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
