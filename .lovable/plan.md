## Ranks-pagina + staff bewerken

### Ranks
- **Migratie**: nieuwe tabel `public.ranks` met `name`, `requirement` (bv. "10 uur speeltijd"), `description`, `color` (hex/tailwind-klasse voor accent), `sort_order`. Public SELECT policy, service_role write, GRANT anon SELECT.
- **Queries/server fns**: `ranksQuery` in `src/lib/queries.ts`; `createRank`, `updateRank`, `deleteRank` in `src/lib/site.functions.ts` (admin-only via bestaande sessie-check).
- **Publieke pagina** `src/routes/ranks.tsx`: lijst van ranks op sort_order, kaart per rank met naam, requirement, beschrijving. Duidelijke intro-tekst "Ranks verdien je door speeltijd, geen webshop". Eigen head() metadata.
- **Navigatie**: "Ranks" link terug in `SiteLayout` nav.
- **Admin**: nieuwe "Ranks" tab in `src/routes/admin.tsx` met add-formulier + lijst met inline edit + delete (zelfde patroon als andere panels).

### Staff bewerken
- Huidige staff-panel heeft alleen toevoegen/verwijderen. Toevoegen: `updateStaff` server function + inline edit-modus in `StaffPanel` (naam/rol/beschrijving aanpassen en opslaan).

Geen wijzigingen aan events, homepage of andere pagina's.
