-- CreateTable
CREATE TABLE "SeventyFiveHardChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startDate" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SeventyFiveHardChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SeventyFiveHardDailyEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weight" REAL,
    "drankWater" BOOLEAN NOT NULL,
    "indoorWorkout" BOOLEAN NOT NULL,
    "outdoorWorkout" BOOLEAN NOT NULL,
    "readTenPages" BOOLEAN NOT NULL,
    "followedDiet" BOOLEAN NOT NULL,
    "imageTaken" BOOLEAN NOT NULL,
    CONSTRAINT "SeventyFiveHardDailyEntry_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "SeventyFiveHardChallenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
