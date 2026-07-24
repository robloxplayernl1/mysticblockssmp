## Wijzigingen

**1. Ranks pagina verwijderen**
- `src/routes/ranks.tsx` verwijderen.
- Link naar Ranks weghalen uit de navigatie in `src/components/site-layout.tsx`.
- Ranks-sectie/vermelding weghalen uit `src/routes/admin.tsx` (tab + mutations).
- `ranks`-query weghalen uit `src/lib/queries.ts` en gerelateerde server functions uit `src/lib/site.functions.ts`.
- Migratie: `DROP TABLE public.ranks`.
- Korte uitleg toevoegen op de homepage: "Ranks verdien je door speeltijd" (in plaats van shop).

**2. Server status (Java + Bedrock)**
- Nieuwe server route `src/routes/api/status.ts` die `https://api.mcsrvstat.us/3/mysticblockssmp.mcsh.io` (Java) en `https://api.mcsrvstat.us/bedrock/3/mysticblockssmp.mcsh.io` opvraagt en gecombineerd teruggeeft: `{ java: { online, players }, bedrock: { online, players } }`. Cache-header 30s.
- Nieuwe query `statusQuery` in `src/lib/queries.ts` die deze route fetcht (refetch elke 60s).
- Nieuwe component `src/components/server-status.tsx` toont twee badges: Java (online/offline + spelersaantal) en Bedrock (idem), met groen/rood bolletje.
- Component tonen op de homepage naast de IP box.

**3. Bedrock support tonen**
- Op `src/routes/index.tsx` in de "Hoe te joinen" sectie een tweede kaart/blok voor Bedrock:
  - IP: `mysticblockssmp.mcsh.io`
  - Poort: `19132`
  - Beide kopieerbaar.
- Head/SEO description licht bijwerken zodat Bedrock ook genoemd wordt.

## Technische details

- mcsrvstat.us is gratis, geen API key nodig, ondersteunt CORS maar we routeren via onze server route zodat we kunnen cachen en één response terugsturen.
- Poort 19132 is de standaard Bedrock UDP-poort.
- Migratie draait via de supabase migration tool; RLS/GRANTs voor `ranks` verdwijnen automatisch met de tabel.
