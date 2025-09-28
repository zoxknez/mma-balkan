-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Fight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "orderNo" INTEGER NOT NULL DEFAULT 1,
    "section" TEXT NOT NULL DEFAULT 'PRELIMS',
    "weightClass" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "redFighterId" TEXT NOT NULL,
    "blueFighterId" TEXT NOT NULL,
    "winnerFighterId" TEXT,
    "method" TEXT,
    "round" INTEGER,
    "time" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Fight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fight_redFighterId_fkey" FOREIGN KEY ("redFighterId") REFERENCES "Fighter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fight_blueFighterId_fkey" FOREIGN KEY ("blueFighterId") REFERENCES "Fighter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Fight" ("blueFighterId", "createdAt", "eventId", "id", "method", "orderNo", "redFighterId", "round", "status", "time", "updatedAt", "weightClass", "winnerFighterId") SELECT "blueFighterId", "createdAt", "eventId", "id", "method", "orderNo", "redFighterId", "round", "status", "time", "updatedAt", "weightClass", "winnerFighterId" FROM "Fight";
DROP TABLE "Fight";
ALTER TABLE "new_Fight" RENAME TO "Fight";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
