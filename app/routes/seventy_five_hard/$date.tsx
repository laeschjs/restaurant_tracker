import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Button, Sheet } from "@mui/joy";
import Alert from "@mui/joy/Alert";
import { Switch, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { requireUserId } from "~/session.server";
import {
  createOrUpdateDailyEntry,
  getChallengesForUser,
} from "~/models/seventyFiveHard";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { SeventyFiveHardDailyEntry } from "@prisma/client";
import { useEffect, useState } from "react";

export async function loader({ request, params }: LoaderArgs) {
  if (!params.date || !dayjs(params.date).isValid()) {
    const today = dayjs(new Date()).format("MM-DD-YYYY");
    return redirect(`../${today}`);
  }
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
  const params = useParams();
  const navigate = useNavigate();
  const date = dayjs(new Date(params.date!));
  const today = dayjs(new Date()).format("MM-DD-YYYY");
  const entry = challenge.dailyEntries.find(
    (entry: SeventyFiveHardDailyEntry) =>
      dayjs(new Date(entry.date)).isSame(date, "day")
  );
  const [weight, setWeight] = useState(entry?.weight ?? "");
  const [drankWater, setDrankWater] = useState(entry?.drankWater ?? false);
  const [indoorWorkout, setIndoorWorkout] = useState(
    entry?.indoorWorkout ?? false
  );
  const [outdoorWorkout, setOutdoorWorkout] = useState(
    entry?.outdoorWorkout ?? false
  );
  const [readTenPages, setReadTenPages] = useState(
    entry?.readTenPages ?? false
  );
  const [followedDiet, setFollowedDiet] = useState(
    entry?.followedDiet ?? false
  );
  const [imageTaken, setImageTaken] = useState(entry?.imageTaken ?? false);
  useEffect(() => {
    if (entry) {
      setWeight(entry.weight || "");
      setDrankWater(entry.drankWater || false);
      setIndoorWorkout(entry.indoorWorkout || false);
      setOutdoorWorkout(entry.outdoorWorkout || false);
      setReadTenPages(entry.readTenPages || false);
      setFollowedDiet(entry.followedDiet || false);
      setImageTaken(entry.imageTaken || false);
    } else {
      setWeight("");
      setDrankWater(false);
      setIndoorWorkout(false);
      setOutdoorWorkout(false);
      setReadTenPages(false);
      setFollowedDiet(false);
      setImageTaken(false);
    }
  }, [entry]);

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
        <input type="hidden" name="entryId" value={entry?.id || ""} />
        <input type="hidden" name="challengeId" value={challenge.id} />
        <DatePicker
          className="my-3"
          value={date}
          onChange={(newValue) =>
            navigate(`../${newValue?.format("MM-DD-YYYY") || today}`)
          }
        />
        <input
          type="hidden"
          name="date"
          value={new Date(date?.format("MM/DD/YYYY")).toString()}
        />
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Weight:</span>
          <TextField
            name="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <label className="my-3 flex grid grid-cols-2 items-center justify-items-start gap-1">
          <span>Drank 1 Gal Water:</span>
          <div>
            No
            <Switch
              name="drankWater"
              checked={drankWater}
              onChange={(e) => setDrankWater(e.target.checked)}
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
              checked={indoorWorkout}
              onChange={(e) => setIndoorWorkout(e.target.checked)}
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
              checked={outdoorWorkout}
              onChange={(e) => setOutdoorWorkout(e.target.checked)}
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
              checked={readTenPages}
              onChange={(e) => setReadTenPages(e.target.checked)}
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
              checked={followedDiet}
              onChange={(e) => setFollowedDiet(e.target.checked)}
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
              checked={imageTaken}
              onChange={(e) => setImageTaken(e.target.checked)}
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
