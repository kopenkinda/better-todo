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
  Select,
  Stack,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconDeviceFloppy, IconPlus, IconTrash } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { useTags } from "../hooks/use-tags";
import { useTodos } from "../hooks/use-todos";
import { newTodoSchema, type Todo } from "../schemas/todo-schema";
import { useState } from "react";

export type TodoModalProps = (
  | { mode: "add" }
  | { mode: "edit"; values: Todo }
) & {
  global?: boolean;
  open: boolean;
  onClose: () => void;
};

export const TodoModal = ({
  onClose,
  open,
  global: _global = false,
  ...mode
}: TodoModalProps) => {
  const { actions } = useTodos();
  const { tags } = useTags();
  const [global, setGlobal] = useState(_global);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Todo>({
    resolver: zodResolver(newTodoSchema),
    defaultValues:
      mode.mode === "edit"
        ? {
            title: mode.values.title,
            description: mode.values.description,
            tag: mode.values.tag,
            isCompleted: mode.values.isCompleted,
          }
        : { title: "", description: "", tag: "_NONE", isCompleted: false },
  });
  const onSubmit = (data: Todo) => {
    if (mode.mode === "edit") {
      actions.edit(
        mode.values.id,
        {
          title: data.title,
          description: data.description,
          tag: data.tag,
          isCompleted: data.isCompleted,
        },
        global
      );
    } else {
      actions.add(
        {
          title: data.title,
          description: data.description,
          tag: data.tag,
        },
        global
      );
    }
    setValue("title", "");
    setValue("description", "");
    setValue("tag", "_NONE");
    setValue("isCompleted", false);
    setGlobal(false);
    onClose();
  };
  return (
    <Modal isOpen={open} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{mode.mode === "add" ? "Add" : "Edit"} todo</ModalHeader>
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
            <FormControl>
              <FormLabel>Tag</FormLabel>
              <Select {...register("tag")}>
                <option value="_NONE">
                  NONE (This task will not be tagged)
                </option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name.toLocaleUpperCase()}
                  </option>
                ))}
              </Select>
              <FormHelperText>
                Add tags to help you find this task later
              </FormHelperText>
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
            {mode.mode === "add" && (
              <FormControl>
                <Box display="flex" alignItems="center" gap=".5rem">
                  <FormLabel margin="0">Global</FormLabel>
                  <Switch
                    value={global ? "true" : "false"}
                    onChange={(e) => setGlobal(e.target.checked)}
                  />
                </Box>
                <FormHelperText>
                  Global tasks will be visible every day until completed or
                  deleted
                </FormHelperText>
              </FormControl>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          {mode.mode === "edit" && (
            <Button
              colorScheme="red"
              mr="2"
              onClick={() => {
                actions.remove(mode.values.id, global);
                onClose();
              }}
              rightIcon={<IconTrash size={16} />}
            >
              Delete
            </Button>
          )}
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
