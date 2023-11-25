DROP TABLE IF EXISTS SENSING;
CREATE TABLE IF NOT EXISTS SENSING (DEVICE_ID VARCHAR(255) PRIMARY KEY, RELATIVE_HUMIDITY INTEGER, ABSOLUTE_HUMIDITY INTEGER,TEMPERATURE INTEGER, CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);