CREATE TABLE IF NOT EXISTS accounts (
  id bigserial PRIMARY KEY,
  currency char(3) NOT NULL,
  description text,
  balance bigint NOT NULL DEFAULT 0
);
