-- Add public site display name (editable in /admin/settings). Run once if site_settings predates this column.
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS site_name TEXT NOT NULL DEFAULT 'Sarap Kitchen';
