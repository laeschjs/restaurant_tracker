import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button, Sheet } from "@mui/joy";
import Alert from "@mui/joy/Alert";
import { Switch, TextField } from "@mui/material";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { requireUserId } from "~/session.server";
import {
  createOrUpdateDailyEntry,
  getChallengesForUser,
} from "~/models/seventyFiveHard";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { SeventyFiveHardDailyEntry } from "@prisma/client";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const challenges = await getChallengesForUser({ userId });
  return json({ challenge: challenges[0] });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  await createOrUpdateDailyEntry({
    id: `${data.entryId}`,
    challengeId: `${data.challengeId}`,
    date: new Date(`${data.date}`),
    weight: parseFloat(`${data.weight}`),
    drankWater: data.drankWater === "on",
    indoorWorkout: data.indoorWorkout === "on",
    outdoorWorkout: data.outdoorWorkout === "on",
    readTenPages: data.readTenPages === "on",
    followedDiet: data.followedDiet === "on",
    imageTaken: data.imageTaken === "on",
  });

  return { message: "Entry updated successfully!", success: true };
}

export default function Daily() {
  const { challenge } = useLoaderData();
  const actionData = useActionData();
  const entry = challenge.dailyEntries.find(
    (entry: SeventyFiveHardDailyEntry) =>
      dayjs(entry.date).isSame(dayjs(), "day")
  );

  // TODO: either add a message or redirect if they go to this route and the current date is not in the challenge

  return (
    <Sheet
      color="neutral"
      variant="outlined"
      className="m-5 rounded-md p-5 text-center sm:mx-auto"
    >
      {actionData && actionData.success && (
        <Alert
          color="success"
          variant="solid"
          className="my-5"
          startDecorator={<FontAwesomeIcon icon={faCircleCheck} size="sm" />}
        >
          {actionData.message}
        </Alert>
      )}
      <Form method="post">
        <input type="hidden" name="entryId" value={entry?.id} />
        <input type="hidden" name="challengeId" value={challenge.id} />
        <input type="hidden" name="date" value={dayjs().toISOString()} />
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Weight:</span>
          <TextField name="weight" defaultValue={entry?.weight} />
        </label>
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Drank 1 Gal Water:</span>
          <div>
            No
            <Switch
              name="drankWater"
              defaultChecked={entry?.drankWater ?? false}
            />
            Yes
          </div>
        </label>
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Indoor Workout:</span>
          <div>
            No
            <Switch
              name="indoorWorkout"
              defaultChecked={entry?.indoorWorkout ?? false}
            />
            Yes
          </div>
        </label>
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Outdoor Workout:</span>
          <div>
            No
            <Switch
              name="outdoorWorkout"
              defaultChecked={entry?.outdoorWorkout ?? false}
            />
            Yes
          </div>
        </label>
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Read 10 Pages:</span>
          <div>
            No
            <Switch
              name="readTenPages"
              defaultChecked={entry?.readTenPages ?? false}
            />
            Yes
          </div>
        </label>
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Follow Diet:</span>
          <div>
            No
            <Switch
              name="followedDiet"
              defaultChecked={entry?.followedDiet ?? false}
            />
            Yes
          </div>
        </label>
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Progress Pic:</span>
          <div>
            No
            <Switch
              name="imageTaken"
              defaultChecked={entry?.imageTaken ?? false}
            />
            Yes
          </div>
        </label>
        <Button type="submit" color="success" size="lg" className="block">
          Update
        </Button>
      </Form>
    </Sheet>
  );
}
