CREATE TABLE IF NOT EXISTS projects (
   id bigserial PRIMARY KEY,
   name text NOT NULL,
   notes text,
   finished bool NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS vendors (
   id bigserial PRIMARY KEY,
   name text NOT NULL,
   notes text,
   active bool NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS customers (
   id bigserial PRIMARY KEY,
   name text NOT NULL,
   notes text,
   active bool NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS shareholders (
   id bigserial PRIMARY KEY,
   name text NOT NULL,
   active bool NOT NULL DEFAULT true
);

