ALTER TABLE payments RENAME COLUMN tx_date TO created_at;
ALTER TABLE collections RENAME COLUMN tx_date TO created_at;
ALTER TABLE investments RENAME COLUMN tx_date TO created_at;
ALTER TABLE dividends RENAME COLUMN tx_date TO created_at;
