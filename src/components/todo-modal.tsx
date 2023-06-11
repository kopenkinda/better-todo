import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useTodos } from "../hooks/use-todos";
import { type Todo } from "../context/todo-provider";
import { IconPlus } from "@tabler/icons-react";

export type TodoModalProps = (
  | { mode: "add" }
  | { mode: "edit"; values: Todo }
) & {
  open: boolean;
  onClose: () => void;
};

export const TodoModal = ({ mode, onClose, open }: TodoModalProps) => {
  const { actions } = useTodos();
  return (
    <Modal isOpen={open} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add todo</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            onClick={() => {
              actions.add({
                title: "New todo",
                description: "",
                tags: [],
              });
              onClose();
            }}
            rightIcon={<IconPlus size={16} />}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
