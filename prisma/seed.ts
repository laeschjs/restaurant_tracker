import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  const restaurants = [
    {
      name: "Walk-On's Sports Bistreaux",
      cuisine: ["American"],
    },
    {
      name: "Fords",
      cuisine: ["American", "Brunch"],
    },
    {
      name: "First Watch",
      cuisine: ["Brunch"],
    },
    {
      name: "Cracker Barrel",
      cuisine: ["American, Brunch"],
    },
    {
      name: "Denny's",
      cuisine: ["American", "Brunch"],
    },
    {
      name: "IHOP",
      cuisine: ["American", "Brunch"],
    },
    {
      name: "Keke's Breakfast Cafe",
      cuisine: ["Brunch"],
    },
  ];

  for (const seed of restaurants) {
    const restaurant = await prisma.restaurant.create({
      data: { name: seed.name },
    });
    for (const seed2 of seed.cuisine) {
      const cuisine = await prisma.cuisine.upsert({
        where: { name: seed2 },
        create: { name: seed2 },
        update: { name: seed2 },
      });
      await prisma.restaurantCuisineMapper.create({
        data: {
          restaurantId: restaurant.id,
          cuisineId: cuisine.id,
        },
      });
    }
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
