-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MealExtra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT,
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

-- Below is custom SQLite I wrote to do the migration
INSERT INTO "MealExtra" ("id", "name", "notes", "rating", "cost", "mealId") SELECT "id", "dish", "notes", "rating", "cost", "id" FROM "Meal";
UPDATE "MealExtra" SET "type" = "entree" WHERE "type" IS NULL;
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
