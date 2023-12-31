DROP TABLE IF EXISTS SENSING;
CREATE TABLE IF NOT EXISTS SENSING (SENSING_ID CHAR(36) PRIMARY KEY, DEVICE_ID CHAR(36) NOT NULL, RELATIVE_HUMIDITY INTEGER NOT NULL, ABSOLUTE_HUMIDITY INTEGER NOT NULL, TEMPERATURE INTEGER NOT NULL, CREATED_AT TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
