import type { User, Cuisine, Meal, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getMeals({
  userId,
  cuisineId,
}: {
  userId: User["id"];
  cuisineId: Cuisine["id"] | null;
}) {
  const where: Prisma.MealWhereInput = {
    userId: userId,
  };
  if (cuisineId) {
    const restaurantPrismaIds = await prisma.restaurantCuisineMapper.findMany({
      where: {
        cuisineId: cuisineId,
      },
      select: {
        restaurantId: true,
      },
    });
    const restaurantIds = restaurantPrismaIds.map((rel) => rel.restaurantId);
    where["restaurantId"] = {
      in: restaurantIds,
    };
  }
  return prisma.meal.findMany({
    where,
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
