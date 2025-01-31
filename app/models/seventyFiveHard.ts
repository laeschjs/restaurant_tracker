import type {
  SeventyFiveHardChallenge,
  SeventyFiveHardDailyEntry,
  User,
} from "@prisma/client";
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

export async function createDailyEntry({
  challengeId,
  date,
}: Pick<SeventyFiveHardDailyEntry, "challengeId" | "date">) {
  return prisma.seventyFiveHardDailyEntry.create({
    data: {
      challengeId,
      date,
      drankWater: false,
      indoorWorkout: false,
      outdoorWorkout: false,
      readTenPages: false,
      followedDiet: false,
      imageTaken: false,
    },
  });
}

export async function updateDailyEntry({
  id,
  weight,
  drankWater,
  indoorWorkout,
  outdoorWorkout,
  readTenPages,
  followedDiet,
  imageTaken,
}: Omit<SeventyFiveHardDailyEntry, "challengeId" | "date">) {
  return prisma.seventyFiveHardDailyEntry.update({
    where: { id },
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
