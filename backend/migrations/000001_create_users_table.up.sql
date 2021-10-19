CREATE TYPE roleenum AS ENUM ('user', 'admin', 'god');

CREATE TABLE IF NOT EXISTS users (
  id bigserial PRIMARY KEY,
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role roleenum NOT NULL DEFAULT 'user',
  password bytea NOT NULL,
  active bool NOT NULL DEFAULT true
);
