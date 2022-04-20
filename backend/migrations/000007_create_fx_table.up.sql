CREATE TABLE IF NOT EXISTS fx (
    currency varchar(6) UNIQUE NOT NULL PRIMARY KEY,
    rate real NOT NULL,
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);
