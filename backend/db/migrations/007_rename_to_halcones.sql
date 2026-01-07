-- 007_rename_to_halcones.sql
UPDATE settings 
SET value = 'Halcones' 
WHERE key = 'site_name' AND value = 'InPages';

UPDATE settings 
SET value = 'contacto@halcones.cl' 
WHERE key = 'support_email' AND value = 'contacto@inpages.cl';
