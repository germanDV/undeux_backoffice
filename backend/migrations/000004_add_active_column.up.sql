ALTER TABLE vendors
ADD COLUMN active bool NOT NULL DEFAULT true;

ALTER TABLE customers
ADD COLUMN active bool NOT NULL DEFAULT true;

