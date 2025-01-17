import { useState } from "react";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import { Button, Sheet, Typography } from "@mui/joy";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateCalendar, DayCalendarSkeleton } from "@mui/x-date-pickers";

import CalendarDate from "~/components/CalendarDate";
import { requireUserId } from "~/session.server";
import {
  createChallenge,
  getChallengesForUser,
} from "~/models/seventyFiveHard";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { SeventyFiveHardDailyEntry } from "@prisma/client";
import { getDateStringWithoutTimezone } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const challenges = await getChallengesForUser({ userId });
  return json({ challenge: challenges[0] });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { startDate } = Object.fromEntries(formData);

  await createChallenge({ userId, startDate: new Date(`${startDate}`) });

  return null;
}

export default function Index() {
  const { challenge } = useLoaderData();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  if (!challenge) {
    return (
      <Sheet
        color="neutral"
        variant="outlined"
        className="m-5 h-full rounded-md p-5 text-center"
      >
        <div className="inline-block">
          <Typography level="body-lg">
            Looks like you haven't started the 75 Hard Challenge. Select your
            start date below to get started!
          </Typography>
          <Form method="post">
            <DatePicker
              className="my-3"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <input
              className="hidden"
              name="startDate"
              value={startDate?.toDateString()}
              onChange={() => ""}
            />
            <Button type="submit" color="success" size="lg" className="block">
              Start!
            </Button>
          </Form>
        </div>
      </Sheet>
    );
  }

  const accomplishedDays: SeventyFiveHardDailyEntry[] =
    challenge.dailyEntries.filter(
      (entry: SeventyFiveHardDailyEntry, index: number) => {
        return (
          Boolean(entry.weight) &&
          entry.drankWater &&
          entry.indoorWorkout &&
          entry.outdoorWorkout &&
          entry.readTenPages &&
          entry.followedDiet &&
          entry.imageTaken
        );
      }
    );
  return (
    <ClientOnly>
      {() => (
        <DateCalendar
          renderLoading={() => <DayCalendarSkeleton />}
          views={["day"]}
          disabled
          slots={{
            day: CalendarDate,
          }}
          slotProps={{
            day: {
              startDate: new Date(challenge.startDate),
              accomplishedDays: accomplishedDays.map(
                (entry: SeventyFiveHardDailyEntry) =>
                  getDateStringWithoutTimezone(new Date(entry.date))
              ),
            } as any,
          }}
        />
      )}
    </ClientOnly>
  );
}
