import { PickersDay } from "@mui/x-date-pickers";
import { Badge } from "@mui/joy";
import type { Dayjs } from "dayjs";

import { formatDate } from "~/utils";

import type { PickersDayProps } from "@mui/x-date-pickers";

export default function CalendarDate(
  props: PickersDayProps<Dayjs> & {
    accomplishedDays?: string[];
    startDate?: Dayjs;
  }
) {
  const { accomplishedDays = [], day, startDate, ...other } = props;

  let badgeContent: string | number = 0;
  let badgeColor: "neutral" | "success" | "primary" = "neutral";
  const isAccomplished = accomplishedDays.indexOf(formatDate(day)) >= 0;
  const isStart = day.isSame(startDate, "day");
  const endDate = startDate?.add(74, "day");
  const isEnd = day.isSame(endDate, "day");

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
