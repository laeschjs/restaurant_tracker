import { prisma } from "~/db.server";

import type { Activity } from "@prisma/client";

export async function createActivity({
  name,
  type,
  themeParkId,
  popularityId,
}: Omit<Activity, "id">) {
  await prisma.activity.create({
    data: {
      name,
      type,
      themeParkId,
      popularityId,
    },
  });
}
