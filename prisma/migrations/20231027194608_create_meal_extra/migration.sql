-- CreateTable
CREATE TABLE "MealExtra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "rating" INTEGER NOT NULL,
    "cost" REAL NOT NULL,
    "mealId" TEXT NOT NULL,
    CONSTRAINT "MealExtra_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
