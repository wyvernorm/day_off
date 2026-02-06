-- Migration: add swap_count to employees
ALTER TABLE employees ADD COLUMN swap_count INTEGER DEFAULT 0;
