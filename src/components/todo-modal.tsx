import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { useTodos } from "../hooks/use-todos";
import { type Todo, newTodoSchema } from "../schemas/todo-schema";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type TodoModalProps = (
  | { mode: "add" }
  | { mode: "edit"; values: Todo }
) & {
  open: boolean;
  onClose: () => void;
};

export const TodoModal = ({ onClose, open, ...mode }: TodoModalProps) => {
  const { actions } = useTodos();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Todo>({
    resolver: zodResolver(newTodoSchema),
    defaultValues:
      mode.mode === "edit"
        ? {
            title: mode.values.title,
            description: mode.values.description,
            tags: mode.values.tags,
            isCompleted: mode.values.isCompleted,
          }
        : { title: "", description: "", tags: [], isCompleted: false },
  });
  const onSubmit = (data: Todo) => {
    if (mode.mode === "edit") {
      actions.edit(mode.values.id, {
        title: data.title,
        description: data.description,
        tags: data.tags,
        isCompleted: data.isCompleted,
      });
    } else {
      actions.add({
        title: data.title,
        description: data.description,
        tags: data.tags,
      });
    }
    onClose();
  };
  return (
    <Modal isOpen={open} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Add todo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="4">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input {...register("title")} placeholder='Ex: "Buy milk"' />
              {errors.title === undefined ? (
                <FormHelperText>
                  Please provide a short, meaningful title
                </FormHelperText>
              ) : (
                <FormErrorMessage>{errors.title.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register("description")}
                placeholder='Ex: "Buy milk"'
              />
              {errors.description === undefined ? (
                <FormHelperText>
                  Describe the task in more detail
                </FormHelperText>
              ) : (
                <FormErrorMessage>
                  {errors.description.message}
                </FormErrorMessage>
              )}
            </FormControl>
            {mode.mode === "edit" && (
              <FormControl>
                <Box display="flex" alignItems="center" gap=".5rem">
                  <FormLabel margin="0">Completed</FormLabel>
                  <Switch {...register("isCompleted")} />
                </Box>
                <FormHelperText>
                  Mark as completed if you have already done this task
                </FormHelperText>
              </FormControl>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="green"
            type="submit"
            rightIcon={
              mode.mode === "add" ? (
                <IconPlus size={16} />
              ) : (
                <IconDeviceFloppy size={16} />
              )
            }
          >
            {mode.mode === "add" ? "Add" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
