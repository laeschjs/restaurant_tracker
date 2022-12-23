import type { User, Restaurant } from "@prisma/client";
import { prisma } from "~/db.server";

export function getMeals({ userId }: { userId: User["id"] }) {
  return prisma.meal.findMany({
    where: { userId: userId },
    include: { restaurant: true },
    orderBy: { eatenAt: "desc" },
  });
}
