import { prisma } from "~/db.server";

import type { RainPeriod } from "@prisma/client";

export async function createRainPeriod({
  themeParkVisitId,
  start,
  end,
}: Omit<RainPeriod, "id">) {
  await prisma.rainPeriod.create({
    data: {
      themeParkVisitId,
      start,
      end,
    },
  });
}
