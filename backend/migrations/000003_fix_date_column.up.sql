ALTER TABLE payments RENAME COLUMN created_at TO tx_date;
ALTER TABLE collections RENAME COLUMN created_at TO tx_date;
ALTER TABLE investments RENAME COLUMN created_at TO tx_date;
ALTER TABLE dividends RENAME COLUMN created_at TO tx_date;
