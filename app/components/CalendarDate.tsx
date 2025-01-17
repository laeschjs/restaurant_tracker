import { PickersDay } from "@mui/x-date-pickers";
import { Badge } from "@mui/joy";

import { getDateStringWithoutTimezone } from "~/utils";

import type { Dayjs } from "dayjs";
import type { PickersDayProps } from "@mui/x-date-pickers";

export default function CalendarDate(
  props: PickersDayProps<Dayjs> & {
    accomplishedDays?: string[];
    startDate?: Date;
  }
) {
  const { accomplishedDays = [], day, startDate, ...other } = props;

  let badgeContent: string | number = 0;
  let badgeColor: "neutral" | "success" | "primary" = "neutral";
  let isStart = false;
  let isEnd = false;
  const dateStringWithoutTimezone = getDateStringWithoutTimezone(day.toDate());
  const isAccomplished =
    accomplishedDays.indexOf(dateStringWithoutTimezone) >= 0;
  if (startDate) {
    isStart =
      getDateStringWithoutTimezone(startDate) === dateStringWithoutTimezone;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 74);
    isEnd = getDateStringWithoutTimezone(endDate) === dateStringWithoutTimezone;
  }

  if (isAccomplished) {
    badgeContent = "✅";
    badgeColor = "success";
  } else if (isStart) {
    badgeContent = "↱";
  } else if (isEnd) {
    badgeContent = "🏁";
    badgeColor = "primary";
  }

  return (
    <Badge
      key={day.toString()}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      badgeContent={badgeContent}
      color={badgeColor}
      badgeInset="5% 20%"
    >
      <PickersDay {...other} day={day} />
    </Badge>
  );
}
