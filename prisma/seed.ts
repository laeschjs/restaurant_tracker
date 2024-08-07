import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@test.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("jkl123jkl", 10);

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

  await prisma.restaurantCuisineMapper.deleteMany({});
  await prisma.meal.deleteMany({});
  await prisma.cuisine.deleteMany({});
  await prisma.restaurant.deleteMany({});

  const restaurants = [
    {
      name: "Walk-On's Sports Bistreaux",
      cuisine: ["American", "Sit-down"],
      meals: [
        {
          eatenAt: new Date("9/21/22"),
          extras: [
            {
              notes:
                "I got the side of beans instead of fries and it was very good, def would recommend getting.",
              name: "Quesadilla",
              rating: 10,
              cost: 20.19,
            },
          ],
        },
      ],
    },
    {
      name: "Fords",
      cuisine: ["American", "Brunch", "Sit-down"],
      meals: [
        {
          eatenAt: new Date("10/24/22"),
          extras: [
            {
              name: "BBQ Mac N Cheese",
              rating: 10,
              cost: 15.85,
              notes: "test",
            },
          ],
        },
      ],
    },
    {
      name: "First Watch",
      cuisine: ["Brunch", "Sit-down"],
      meals: [
        {
          eatenAt: new Date("12/04/22"),
          extras: [
            {
              notes: "This is only an option in the winter.",
              name: "Cinnamon chip pancake",
              rating: 10,
              cost: 12.37,
            },
          ],
        },
      ],
    },
    {
      name: "Cracker Barrel",
      cuisine: ["American", "Brunch", "Sit-down"],
      meals: [],
    },
    {
      name: "Denny's",
      cuisine: ["American", "Brunch", "Sit-down"],
      meals: [],
    },
    {
      name: "IHOP",
      cuisine: ["American", "Brunch", "Sit-down"],
      meals: [],
    },
    {
      name: "Keke's Breakfast Cafe",
      cuisine: ["Brunch", "Sit-down"],
      meals: [],
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
    for (const seed3 of seed.meals) {
      const meal = await prisma.meal.create({
        data: {
          restaurantId: restaurant.id,
          userId: user.id,
          eatenAt: seed3.eatenAt,
        },
      });
      for (const seed4 of seed3.extras) {
        await prisma.mealExtra.create({
          data: {
            mealId: meal.id,
            name: seed4.name,
            notes: seed4.notes,
            rating: seed4.rating,
            cost: seed4.cost,
            type: "entree",
          },
        });
      }
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
