import { prisma } from "~/db.server";

import type { Popularity } from "@prisma/client";

export async function createPopularity({
  type,
  lowRange,
  midRange,
  highRange,
}: Omit<Popularity, "id">) {
  await prisma.popularity.create({
    data: {
      type,
      lowRange,
      midRange,
      highRange,
    },
  });
}
