import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTag, IconTrash } from "@tabler/icons-react";
import { ComponentProps, useState } from "react";
import { useForm } from "react-hook-form";
import { useTags } from "../hooks/use-tags";
import { type Tag, tagColors, tagSchema } from "../schemas/tags-schema";

export const ManageTags = (
  props: Omit<
    ComponentProps<typeof Button>,
    "onClick" | "size" | "aspectRatio" | "padding"
  >
) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        size="sm"
        aspectRatio={1}
        padding={1}
        onClick={() => setOpen(true)}
        {...props}
      >
        <IconTag size={16} />
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Tags</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TagManager />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const pickRandomColor = () => {
  return tagColors[Math.floor(Math.random() * tagColors.length)];
};

const TagManager = () => {
  const { tags, ...actions } = useTags();
  const { register, handleSubmit, setValue } = useForm<Tag>({
    resolver: zodResolver(tagSchema.omit({ id: true })),
    defaultValues: {
      color: pickRandomColor(),
      name: "",
    },
  });
  return (
    <Box display="flex" flexDirection="column" gap=".5rem">
      <Box
        as="form"
        onSubmit={handleSubmit((data) => {
          actions.add(data);
          setValue("name", "");
          setValue("color", pickRandomColor());
        })}
        display="flex"
        gap=".25rem"
        alignItems="center"
      >
        <Input
          {...register("name")}
          placeholder='Ex: "Important"'
          minLength={tagSchema.shape.name.minLength || undefined}
          maxLength={tagSchema.shape.name.maxLength || undefined}
        />
        <IconButton aria-label="Create a label" type="submit">
          <IconPlus size={16} />
        </IconButton>
      </Box>
      {tags.map((tag) => (
        <Box
          key={tag.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Badge colorScheme={tag.color} fontSize="md">
            {tag.name}
          </Badge>
          <ButtonGroup isAttached>
            <IconButton
              aria-label={`Delete ${tag.name} tag`}
              onClick={() => actions.remove(tag.id)}
              size="sm"
              colorScheme="red"
            >
              <IconTrash size={16} />
            </IconButton>
          </ButtonGroup>
        </Box>
      ))}
    </Box>
  );
};
