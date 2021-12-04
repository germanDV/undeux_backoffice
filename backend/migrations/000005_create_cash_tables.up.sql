CREATE TABLE IF NOT EXISTS payments (
   id bigserial PRIMARY KEY,
   tx_date timestamp(0) with time zone NOT NULL DEFAULT NOW(),
   amount bigint NOT NULL,
   account_id int NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
   project_id int NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
   vendor_id int NOT NULL REFERENCES vendors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collections (
   id bigserial PRIMARY KEY,
   tx_date timestamp(0) with time zone NOT NULL DEFAULT NOW(),
   amount bigint NOT NULL,
   account_id int NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
   project_id int NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
   customer_id int NOT NULL REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS investments (
   id bigserial PRIMARY KEY,
   tx_date timestamp(0) with time zone NOT NULL DEFAULT NOW(),
   amount bigint NOT NULL,
   account_id int NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
   shareholder_id int NOT NULL REFERENCES shareholders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dividends (
   id bigserial PRIMARY KEY,
   tx_date timestamp(0) with time zone NOT NULL DEFAULT NOW(),
   amount bigint NOT NULL,
   account_id int NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
   shareholder_id int NOT NULL REFERENCES shareholders(id) ON DELETE CASCADE
);

