import { prisma } from "~/db.server";

import type { ActivityAction } from "@prisma/client";

export async function createActivityAction({
  themeParkVisitId,
  activityId,
  claimedWait,
  actualWait,
}: Omit<ActivityAction, "id">) {
  await prisma.activityAction.create({
    data: {
      themeParkVisitId,
      activityId,
      claimedWait,
      actualWait,
    },
  });
}
