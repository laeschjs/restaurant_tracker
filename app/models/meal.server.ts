import type { User, Cuisine, Meal, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getMeals({
  userId,
  cuisineId,
  showFriends,
}: {
  userId: User["id"];
  cuisineId: Cuisine["id"] | null;
  showFriends: boolean;
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
  if (showFriends) {
    const friendIds = await prisma.friendMapper.findMany({
      where: {
        selfId: userId,
      },
      select: {
        friendId: true,
      },
    });
    const allUserIds = friendIds.map((rel) => rel.friendId).concat([userId]);
    where["userId"] = {
      in: allUserIds,
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
  eatenAt,
}: Omit<Meal, "id">) {
  return prisma.meal.create({
    data: {
      dish,
      notes,
      cost,
      rating,
      reservation,
      queueTime,
      eatenAt,
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
