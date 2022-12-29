import { prisma } from "~/db.server";
import type { Restaurant } from "@prisma/client";

export function getRestaurants() {
  return prisma.restaurant.findMany();
}

export function createRestaurant({ name }: Pick<Restaurant, "name">) {
  return prisma.restaurant.create({ data: { name } });
}
