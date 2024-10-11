-- AlterTable
ALTER TABLE "User" ADD COLUMN "height" INTEGER;

-- CreateTable
CREATE TABLE "ThemePark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ThemeParkVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "themeParkId" TEXT NOT NULL,
    CONSTRAINT "ThemeParkVisit_themeParkId_fkey" FOREIGN KEY ("themeParkId") REFERENCES "ThemePark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RainPeriod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "themeParkVisitId" TEXT NOT NULL,
    CONSTRAINT "RainPeriod_themeParkVisitId_fkey" FOREIGN KEY ("themeParkVisitId") REFERENCES "ThemeParkVisit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Popularity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "lowRange" INTEGER NOT NULL,
    "midRange" INTEGER NOT NULL,
    "highRange" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "themeParkId" TEXT NOT NULL,
    "popularityId" TEXT NOT NULL,
    CONSTRAINT "Activity_themeParkId_fkey" FOREIGN KEY ("themeParkId") REFERENCES "ThemePark" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_popularityId_fkey" FOREIGN KEY ("popularityId") REFERENCES "Popularity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "claimedWait" INTEGER,
    "actualWait" INTEGER,
    "activityId" TEXT NOT NULL,
    "themeParkVisitId" TEXT NOT NULL,
    CONSTRAINT "ActivityAction_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityAction_themeParkVisitId_fkey" FOREIGN KEY ("themeParkVisitId") REFERENCES "ThemeParkVisit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ThemeParkVisitToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ThemeParkVisitToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ThemeParkVisit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ThemeParkVisitToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ThemePark_name_key" ON "ThemePark"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_name_key" ON "Activity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ThemeParkVisitToUser_AB_unique" ON "_ThemeParkVisitToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ThemeParkVisitToUser_B_index" ON "_ThemeParkVisitToUser"("B");
