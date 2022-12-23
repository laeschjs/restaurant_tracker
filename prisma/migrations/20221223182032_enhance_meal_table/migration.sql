/*
  Warnings:

  - Added the required column `cost` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eatenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "dish" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "queueTime" INTEGER NOT NULL DEFAULT 0,
    "reservation" BOOLEAN NOT NULL DEFAULT false,
    "cost" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Meal_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Meal" ("dish", "eatenAt", "id", "notes", "queueTime", "rating", "reservation", "restaurantId", "userId") SELECT "dish", "eatenAt", "id", "notes", "queueTime", "rating", "reservation", "restaurantId", "userId" FROM "Meal";
DROP TABLE "Meal";
ALTER TABLE "new_Meal" RENAME TO "Meal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
