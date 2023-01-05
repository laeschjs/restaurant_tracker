import { prisma } from "~/db.server";
import type { Cuisine } from "@prisma/client";

export function getCuisines() {
  return prisma.cuisine.findMany();
}

export function createCuisine({ name }: Pick<Cuisine, "name">) {
  return prisma.cuisine.upsert({
    where: { name },
    create: { name },
    update: { name },
  });
}
