-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ThemeParkVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayTicketPrice" REAL,
    "start" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" DATETIME,
    "themeParkId" TEXT NOT NULL,
    CONSTRAINT "ThemeParkVisit_themeParkId_fkey" FOREIGN KEY ("themeParkId") REFERENCES "ThemePark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ThemeParkVisit" ("end", "id", "start", "themeParkId") SELECT "end", "id", "start", "themeParkId" FROM "ThemeParkVisit";
DROP TABLE "ThemeParkVisit";
ALTER TABLE "new_ThemeParkVisit" RENAME TO "ThemeParkVisit";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
