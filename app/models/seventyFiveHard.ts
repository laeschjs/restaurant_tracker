import type {
  SeventyFiveHardChallenge,
  SeventyFiveHardDailyEntry,
  User,
} from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "~/db.server";

export async function getChallengesForUser({ userId }: { userId: User["id"] }) {
  return prisma.seventyFiveHardChallenge.findMany({
    where: {
      userId: userId,
    },
    include: { dailyEntries: true },
  });
}

export async function createChallenge({
  userId,
  startDate,
}: Omit<SeventyFiveHardChallenge, "id">) {
  return prisma.seventyFiveHardChallenge.create({
    data: {
      userId: userId,
      startDate,
    },
  });
}

export async function createOrUpdateDailyEntry({
  challengeId,
  date,
  weight,
  drankWater,
  indoorWorkout,
  outdoorWorkout,
  readTenPages,
  followedDiet,
  imageTaken,
}: Omit<SeventyFiveHardDailyEntry, "id">) {
  // TODO make challengeId and date combo unique so then this can be changed to upsert
  const challengeEntries = await prisma.seventyFiveHardDailyEntry.findMany({
    where: { challengeId },
  });
  const existingEntry = challengeEntries.find((entry) =>
    dayjs(entry.date).isSame(dayjs(date), "day")
  );
  if (existingEntry) {
    return prisma.seventyFiveHardDailyEntry.update({
      where: { id: existingEntry.id },
      data: {
        weight,
        drankWater,
        indoorWorkout,
        outdoorWorkout,
        readTenPages,
        followedDiet,
        imageTaken,
      },
    });
  }
  return prisma.seventyFiveHardDailyEntry.create({
    data: {
      challengeId,
      date,
      weight,
      drankWater,
      indoorWorkout,
      outdoorWorkout,
      readTenPages,
      followedDiet,
      imageTaken,
    },
  });
}
