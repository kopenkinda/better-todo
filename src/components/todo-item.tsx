import {
  Badge,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { IconCheckbox, IconEdit, IconSquare } from "@tabler/icons-react";
import { useState } from "react";
import { useTags } from "../hooks/use-tags";
import { useTodos } from "../hooks/use-todos";
import { type Todo } from "../schemas/todo-schema";
import { TodoModal } from "./todo-modal";

export const TodoItem = ({ todo }: { todo: Todo }) => {
  const { actions } = useTodos();
  const { tags } = useTags();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tag = tags.find((t) => t.id === todo.tag);
  return (
    <>
      <Card opacity={todo.isCompleted ? 0.4 : 1}>
        <CardBody display="grid" gridTemplateColumns="1fr auto">
          <Text
            decoration={todo.isCompleted ? "line-through" : undefined}
            margin={0}
          >
            {todo.title}
          </Text>
          <ButtonGroup isAttached>
            <IconButton
              aria-label={`Mark the "${todo.title}" todo as completed`}
              size="sm"
              onClick={() => actions.toggle(todo.id)}
            >
              {todo.isCompleted ? (
                <IconCheckbox size={16} />
              ) : (
                <IconSquare size={16} />
              )}
            </IconButton>
            <IconButton
              aria-label={`Edit the "${todo.title}" todo`}
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <IconEdit size={16} />
            </IconButton>
          </ButtonGroup>
        </CardBody>
        {tag != null && (
          <CardFooter m={0} pt={0}>
            <Badge colorScheme={tag.color}>{tag.name}</Badge>
          </CardFooter>
        )}
      </Card>
      {isModalOpen && (
        <TodoModal
          mode="edit"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          values={todo}
        />
      )}
    </>
  );
};
