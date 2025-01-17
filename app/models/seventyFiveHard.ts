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

export async function createOrUpdateDailyEntry({
  id,
  challengeId,
  date,
  weight,
  drankWater,
  indoorWorkout,
  outdoorWorkout,
  readTenPages,
  followedDiet,
  imageTaken,
}: SeventyFiveHardDailyEntry) {
  return prisma.seventyFiveHardDailyEntry.upsert({
    where: { id },
    create: {
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
    update: {
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
