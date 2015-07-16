PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE "actuators" ("id" VARCHAR PRIMARY KEY  NOT NULL  UNIQUE , "name" VARCHAR NOT NULL , "description" VARCHAR, "api" TEXT, "pin" INTEGER NOT NULL , "ioType" VARCHAR NOT NULL , "active" BOOL NOT NULL );
INSERT INTO "actuators" VALUES('3','relay',NULL,'["ON","OFF"]',3,'analog','true');
COMMIT;
