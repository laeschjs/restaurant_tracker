import { prisma } from "~/db.server";
import type { Restaurant } from "@prisma/client";

export function getRestaurants() {
  return prisma.restaurant.findMany();
}

export async function createRestaurant({
  name,
  cuisines,
}: {
  name: string;
  cuisines: FormDataEntryValue[];
}) {
  const restaurant = await prisma.restaurant.create({ data: { name } });
  for (const cuisineName of cuisines) {
    const cuisine = await prisma.cuisine.findUnique({
      where: { name: `${cuisineName}` },
    });
    if (cuisine) {
      await prisma.restaurantCuisineMapper.create({
        data: {
          restaurantId: restaurant.id,
          cuisineId: cuisine.id,
        },
      });
    }
  }
}
