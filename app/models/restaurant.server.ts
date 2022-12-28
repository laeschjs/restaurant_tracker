import { prisma } from "~/db.server";

export function getRestaurants() {
  return prisma.restaurant.findMany();
}
