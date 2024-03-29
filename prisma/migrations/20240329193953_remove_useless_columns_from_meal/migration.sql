/*
  Warnings:

  - You are about to drop the column `cost` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `dish` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Meal` table. All the data in the column will be lost.
  - Made the column `type` on table `MealExtra` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eatenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queueTime" INTEGER NOT NULL DEFAULT 0,
    "reservation" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Meal_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Meal" ("eatenAt", "id", "queueTime", "reservation", "restaurantId", "userId") SELECT "eatenAt", "id", "queueTime", "reservation", "restaurantId", "userId" FROM "Meal";
DROP TABLE "Meal";
ALTER TABLE "new_Meal" RENAME TO "Meal";
CREATE TABLE "new_MealExtra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "rating" INTEGER NOT NULL,
    "cost" REAL NOT NULL,
    "mealId" TEXT NOT NULL,
    CONSTRAINT "MealExtra_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MealExtra" ("cost", "id", "mealId", "name", "notes", "rating", "type") SELECT "cost", "id", "mealId", "name", "notes", "rating", "type" FROM "MealExtra";
DROP TABLE "MealExtra";
ALTER TABLE "new_MealExtra" RENAME TO "MealExtra";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
