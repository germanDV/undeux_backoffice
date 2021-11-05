CREATE TABLE IF NOT EXISTS projects (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    notes text,
    finished bool NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS vendors (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    notes text
);

CREATE TABLE IF NOT EXISTS customers (
   id bigserial PRIMARY KEY,
   name text NOT NULL,
   notes text
);

CREATE TABLE IF NOT EXISTS shareholders (
    id bigserial PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
    id bigserial PRIMARY KEY,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    amount bigint NOT NULL,
    currency char(3) NOT NULL DEFAULT 'USD',
    project_id int NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id int NOT NULL REFERENCES vendors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collections (
    id bigserial PRIMARY KEY,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    amount bigint NOT NULL,
    currency char(3) NOT NULL DEFAULT 'USD',
    project_id int NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    customer_id int NOT NULL REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS investments (
   id bigserial PRIMARY KEY,
   created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
   amount bigint NOT NULL,
   currency char(3) NOT NULL DEFAULT 'USD',
   shareholder_id int NOT NULL REFERENCES shareholders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dividends (
   id bigserial PRIMARY KEY,
   created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
   amount bigint NOT NULL,
   currency char(3) NOT NULL DEFAULT 'USD',
   shareholder_id int NOT NULL REFERENCES shareholders(id) ON DELETE CASCADE
);
