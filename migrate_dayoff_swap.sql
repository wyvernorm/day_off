-- Migration: add swap_type and date2 for day-off swap
ALTER TABLE swap_requests ADD COLUMN swap_type TEXT DEFAULT 'shift';
ALTER TABLE swap_requests ADD COLUMN date2 TEXT;
