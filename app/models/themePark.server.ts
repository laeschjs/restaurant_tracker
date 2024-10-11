import { prisma } from "~/db.server";

import type { ThemePark } from "@prisma/client";

export function getThemeParks() {
  return prisma.themePark.findMany();
}

export async function createThemePark({ name }: Omit<ThemePark, "id">) {
  await prisma.themePark.create({
    data: {
      name,
    },
  });
}
