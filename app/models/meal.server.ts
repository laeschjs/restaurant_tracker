import type { User } from "@prisma/client";
import { prisma } from "~/db.server";
import type { Meal } from "@prisma/client";

export function getMeals({ userId }: { userId: User["id"] }) {
  return prisma.meal.findMany({
    where: { userId: userId },
    include: { restaurant: true },
    orderBy: { eatenAt: "desc" },
  });
}

export function createMeal({
  dish,
  notes,
  cost,
  rating,
  reservation,
  queueTime,
  restaurantId,
  userId,
}: Omit<Meal, "id" | "eatenAt">) {
  return prisma.meal.create({
    data: {
      dish,
      notes,
      cost,
      rating,
      reservation,
      queueTime,
      restaurant: {
        connect: {
          id: restaurantId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
