-- Migration: add last_login to employees
ALTER TABLE employees ADD COLUMN last_login TEXT;
