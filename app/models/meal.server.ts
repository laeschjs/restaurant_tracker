import type { User, Cuisine, Meal, Prisma, Restaurant } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getMeals({
  userId,
  filterId,
  filterType,
  showFriends,
}: {
  userId: User["id"];
  filterId: Restaurant["id"] | Cuisine["id"] | null;
  filterType: string | null;
  showFriends: boolean;
}) {
  const where: Prisma.MealWhereInput = {
    userId: userId,
  };
  if (filterType === "cuisines" && filterId) {
    const restaurantPrismaIds = await prisma.restaurantCuisineMapper.findMany({
      where: {
        cuisineId: filterId,
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
  if (filterType === "restaurants" && filterId) {
    where["restaurantId"] = {
      in: [filterId],
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
    include: { restaurant: true, extras: true },
    orderBy: { eatenAt: "desc" },
  });
}

export interface MealExtraParam {
  type: string;
  name: string;
  notes: string;
  rating: string;
  cost: string;
}

export async function createMeal({
  reservation,
  queueTime,
  restaurantId,
  userId,
  eatenAt,
  extras,
}: Omit<Meal, "id"> & { extras: MealExtraParam[] }) {
  const meal = await prisma.meal.create({
    data: {
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
  for (const extra of extras) {
    await prisma.mealExtra.create({
      data: {
        ...extra,
        rating: parseInt(extra.rating),
        cost: parseFloat(extra.cost),
        mealId: meal.id,
      },
    });
  }
}

export function editMeal({
  id,
  reservation,
  queueTime,
  restaurantId,
  userId,
  eatenAt,
}: Meal) {
  return prisma.meal.update({
    where: {
      id,
    },
    data: {
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

export function deleteMeal(id: Meal["id"]) {
  return prisma.meal.delete({
    where: {
      id,
    },
  });
}
