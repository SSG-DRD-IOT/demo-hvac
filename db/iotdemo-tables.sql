PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE "actuators" ("id" VARCHAR PRIMARY KEY  NOT NULL  UNIQUE , "name" VARCHAR NOT NULL , "description" VARCHAR, "api" TEXT, "pin" INTEGER NOT NULL , "ioType" VARCHAR NOT NULL , "active" BOOL NOT NULL );
INSERT INTO "actuators" VALUES('752293f38a3d0e683178cdac2f864468','Fan',NULL,'["ON","OFF"]',3,'digital','true');
INSERT INTO "actuators" VALUES('e7b29b749fa4d940e0d43ab6a4f94f41','Lamp',NULL,'["ON","OFF"]',3,'digital','true');
CREATE TABLE "cloudproviders" ("id" INTEGER PRIMARY KEY  NOT NULL , "name" VARCHAR NOT NULL );
INSERT INTO "cloudproviders" VALUES(1,'microsoft-azure');
INSERT INTO "cloudproviders" VALUES(2,'ibm-bluemix');
INSERT INTO "cloudproviders" VALUES(3,'google-datastore');
INSERT INTO "cloudproviders" VALUES(4,'amazon-kinesis');
CREATE TABLE "sensors_clouds" ("id" INTEGER PRIMARY KEY  NOT NULL , "sensor_id" INTEGER NOT NULL , "cloudprovider_id" INTEGER NOT NULL );
INSERT INTO "sensors_clouds" VALUES(1,'b506768ce1e2353fe063d344e89e53e5',1);
INSERT INTO "sensors_clouds" VALUES(2,'b506768ce1e2353fe063d344e89e53e5',2);
INSERT INTO "sensors_clouds" VALUES(3,'b506768ce1e2353fe063d344e89e53e5',3);
CREATE TABLE "sensors" ("id" VARCHAR PRIMARY KEY  NOT NULL  UNIQUE , "name" VARCHAR NOT NULL , "description" VARCHAR, "maxfrequency" INTEGER NOT NULL  DEFAULT 1000, "frequency" INTEGER NOT NULL  DEFAULT 1000, "active" BOOL NOT NULL  DEFAULT true, "ioType" VARCHAR);
CREATE TABLE "data" ("id" INTEGER PRIMARY KEY  NOT NULL ,"sensor_id" INTEGER NOT NULL ,"value" INTEGER NOT NULL , "timestamp" INTEGER);
INSERT INTO "data" VALUES(1,'c855aa4a02e2f7b1494ca9205b0f282c',679,1435621610121);
CREATE TABLE "triggers" (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name`	VARCHAR NOT NULL,
	`sensor_id`	INTEGER NOT NULL,
	`actuator_id`	INTEGER NOT NULL,
	`verification_id`	INTEGER,
	`condition`	TEXT NOT NULL,
	`triggerFunc`	TEXT NOT NULL,
	`active`	BOOL NOT NULL DEFAULT true
);

-- Temperature Sensor ID: b506768ce1e2353fe063d344e89e53e5
-- Sound sensor ID: fa57e02e18def69d43ca95a078679b19
-- Light Sensor ID: c855aa4a02e2f7b1494ca9205b0f282c

INSERT INTO "triggers" VALUES(1,'FanOn','b506768ce1e2353fe063d344e89e53e5','752293f38a3d0e683178cdac2f864468','>80','{"triggerFunc":"on"}','true');
INSERT INTO "triggers" VALUES(2,'LampOn','b506768ce1e2353fe063d344e89e53e5','e7b29b749fa4d940e0d43ab6a4f94f41','<68','{"triggerFunc":"on"}','true');
INSERT INTO "triggers" VALUES(3,'FanOff','b506768ce1e2353fe063d344e89e53e5','752293f38a3d0e683178cdac2f864468','<80','{"triggerFunc":"off"}','true');
INSERT INTO "triggers" VALUES(4,'LampOff','b506768ce1e2353fe063d344e89e53e5','e7b29b749fa4d940e0d43ab6a4f94f41','>68','{"triggerFunc":"off"}','true');
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('triggers',2);
COMMIT;
