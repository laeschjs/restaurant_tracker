import { useParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { endThemeParkVisit } from "~/models/themeParkVisit.server";

import type { Dayjs } from "dayjs";
import type { ActionArgs } from "@remix-run/node";

export async function action({ params, request }: ActionArgs) {
  const formData = await request.formData();
  const { controlFlow, ...values } = Object.fromEntries(formData);

  switch (controlFlow) {
    case "endVisit":
      await endThemeParkVisit({
        id: params.visitId!,
        endTime: new Date(`${values.endTime}`),
      });
      return redirect(`/parks`);
    default:
      return json({ message: `Nothing happened` });
  }
}

export default function VisitInProgress() {
  const { visitId } = useParams();
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
  // 3 main functionalities:
  // - Add activity actions
  // - Add rain periods
  // - end the visit (probably just a button towards the top that will open a modal
  //   for the person to enter the datetime which will default to the current time)
  return (
    <form method="post">
      <h1>TODO: Kickoff {visitId}</h1>
      <label className="my-3 flex grid grid-cols-4 items-center gap-1">
        <span className="col-span-1">End Time:</span>
        <DateTimePicker
          className="col-span-3"
          value={endTime}
          onChange={(newValue) => setEndTime(newValue)}
          disableFuture
        />
        <input
          className="hidden"
          name="endTime"
          value={endTime?.toISOString()}
          onChange={() => ""}
        />
      </label>
      <button
        type="submit"
        name="controlFlow"
        value="endVisit"
        className="w-full rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
      >
        Submit
      </button>
    </form>
  );
}
