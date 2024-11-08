import { useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import Alert from "@mui/joy/Alert";
import Sheet from "@mui/joy/Sheet";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import {
  endThemeParkVisit,
  getThemeParkVisit,
} from "~/models/themeParkVisit.server";
import { getActivities } from "~/models/activity.server";
import { createActivityAction } from "~/models/activityAction.server";

import type { Dayjs } from "dayjs";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";

const SHEET_STYLES = {
  mx: 5,
  my: 4,
  py: 3,
  px: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  borderRadius: "sm",
  boxShadow: "md",
};

export async function loader({ params }: LoaderArgs) {
  const themeParkVisit = await getThemeParkVisit({ visitId: params.visitId! });
  if (!themeParkVisit) {
    return redirect(`/parks`);
  }

  const activities = await getActivities({
    themeParkId: themeParkVisit.themeParkId,
  });
  return json({ activities });
}

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
    case "createActivityAction":
      await createActivityAction({
        themeParkVisitId: params.visitId!,
        activityId: `${values.activityId}`,
        claimedWait: parseInt(`${values.claimedWaitTime}`),
        actualWait: parseInt(`${values.actualWaitTime}`),
      });
      return json({ message: `Activity added` });
    default:
      return json({ message: `Nothing happened` });
  }
}

export default function VisitInProgress() {
  const { activities } = useLoaderData();
  const actionData = useActionData();
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );
  // 3 main functionalities:
  // - Add activity actions
  // - Add rain periods
  // - end the visit (probably just a button towards the top that will open a modal
  //   for the person to enter the datetime which will default to the current time)
  return (
    <form method="post">
      {actionData?.message && (
        <Alert
          color="success"
          variant="solid"
          className="my-5 mx-9"
          startDecorator={<FontAwesomeIcon icon={faCircleCheck} size="sm" />}
        >
          {actionData.message}
        </Alert>
      )}
      <Sheet sx={SHEET_STYLES}>
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
          End Visit
        </button>
      </Sheet>
      <Sheet sx={SHEET_STYLES}>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Attraction:</span>
          <Select
            name="activityId"
            options={activities.map((activity: any) => ({
              label: activity.name,
              value: activity.id,
            }))}
            onChange={(selectedOption: { value: string } | null) =>
              setSelectedActivityId(selectedOption?.value || null)
            }
          />
          {selectedActivityId && (
            <input
              className="hidden"
              name="activityId"
              value={selectedActivityId}
              onChange={() => ""}
            />
          )}
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Claimed Wait Time:</span>
          <TextField name="claimedWaitTime" className="col-span-3" />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Actual Wait Time:</span>
          <TextField name="actualWaitTime" className="col-span-3" />
        </label>
        <button
          type="submit"
          name="controlFlow"
          value="createActivityAction"
          className="w-full rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Add Activity
        </button>
      </Sheet>
    </form>
  );
}
