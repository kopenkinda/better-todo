import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { IconCalendar } from "@tabler/icons-react";
import {
  Calendar,
  CalendarControls,
  CalendarDays,
  CalendarMonth,
  CalendarMonthName,
  CalendarMonths,
  CalendarNextButton,
  CalendarPrevButton,
  CalendarWeek,
} from "@uselessdev/datepicker";
import { useTodos } from "../hooks/use-todos";

export const AppDateSelector = () => {
  const { forDate, setDate } = useTodos();
  const handleSelectDate = (date: Date) => setDate(date);

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="sm" leftIcon={<IconCalendar size={16} />}>
          {forDate.toDateString()}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        p={0}
        w="min-content"
        border="none"
        outline="none"
        _focus={{ boxShadow: "none" }}
      >
        <Calendar
          value={{ start: forDate }}
          onSelectDate={(d) => {
            if (d instanceof Date) {
              handleSelectDate(d);
            }
          }}
          singleDateSelection
          highlightToday
        >
          <PopoverBody p={0}>
            <CalendarControls>
              <CalendarPrevButton />
              <CalendarNextButton />
            </CalendarControls>
            <CalendarMonths>
              <CalendarMonth>
                <CalendarMonthName />
                <CalendarWeek />
                <CalendarDays />
              </CalendarMonth>
            </CalendarMonths>
          </PopoverBody>
        </Calendar>
      </PopoverContent>
    </Popover>
  );
};
