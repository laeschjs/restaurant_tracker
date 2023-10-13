import { prisma } from "~/db.server";

export function getRestaurants() {
  return prisma.restaurant.findMany({
    include: { cuisines: { include: { cuisine: true } } },
  });
}

export async function upsertRestaurant({
  name,
  cuisines,
}: {
  name: string;
  cuisines: FormDataEntryValue[];
}) {
  const restaurant = await prisma.restaurant.upsert({
    where: { name },
    create: { name },
    update: { name },
  });
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
