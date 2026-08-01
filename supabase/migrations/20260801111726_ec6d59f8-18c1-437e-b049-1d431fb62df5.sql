ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS opening_hours text NOT NULL DEFAULT 'Maandag: 6:00 - 11:00
Dinsdag: 6:00 - 11:00
Woensdag: 6:00 - 11:00
Donderdag: 6:00 - 11:00
Vrijdag: 6:00 - 12:00
Zaterdag: 6:00 - 12:00
Zondag: 6:00 - 11:00';

UPDATE public.site_settings SET opening_hours = 'Maandag: 6:00 - 11:00
Dinsdag: 6:00 - 11:00
Woensdag: 6:00 - 11:00
Donderdag: 6:00 - 11:00
Vrijdag: 6:00 - 12:00
Zaterdag: 6:00 - 12:00
Zondag: 6:00 - 11:00' WHERE id = 'main';