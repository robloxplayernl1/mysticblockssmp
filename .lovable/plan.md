# Kalender met RSVP, live serverstatus en polls

Drie uitbreidingen voor MysticBlocksSMP, allemaal te beheren vanuit het bestaande admin-paneel.

## 1. Evenementen-kalender met aanmelden

- De events-pagina krijgt naast de lijst een maandkalender: dagen met een event zijn gemarkeerd, klikken toont de events van die dag.
- Onder elk aankomend event komt een knop "Ik doe mee" met een veld voor de Minecraft-naam. Bezoekers hoeven geen account te maken.
- Per event zie je hoeveel spelers zich hebben aangemeld en een lijst met hun namen.
- Dubbele aanmeldingen worden geweigerd (zelfde naam op zelfde event), en de browser onthoudt waarvoor je je al hebt aangemeld zodat je je ook weer kunt afmelden.
- Voorbije events tonen geen aanmeldknop meer.
- In het admin-paneel zie je bij elk event de aanmeldingen en kun je ze verwijderen; aanmelden kan per event aan/uit worden gezet.

## 2. Live serverstatus-widget

De huidige kleine status-badge wordt een echte widget met:
- online/offline lampje
- aantal spelers online / maximaal
- serverversie
- reactietijd (ping) van de server
- laatst ververst-tijdstip, met automatisch verversen elke 30 seconden

De widget komt op de homepage; de kleine badge blijft elders bruikbaar.

## 3. Stemmen / polls

- Nieuwe pagina "Polls" in het menu met de actieve peiling(en): vraag, antwoordopties, stemknop.
- Na het stemmen zie je direct de resultaten als balken met percentages en aantallen.
- Eén stem per browser per poll; gesloten polls tonen alleen de uitslag.
- Admin-tabblad "Polls": poll aanmaken met vrije antwoordopties, openen/sluiten, resultaten bekijken en polls verwijderen.

## Technische details

- Database: nieuwe tabellen `event_rsvps` (event, minecraft-naam, browser-token, uniek per event+naam), `polls` (vraag, status open/gesloten, volgorde), `poll_options` (poll, tekst, volgorde) en `poll_votes` (optie, browser-token, uniek per poll+token). Publiek leesbaar via bestaande patroon; schrijven alleen via server-functies (RESTRICTIVE policies zoals de andere tabellen) plus expliciete GRANTs. Kolom `rsvp_enabled` op `events`.
- Server-functies in `src/lib/site.functions.ts`: `submitRsvp`, `cancelRsvp`, `listRsvps` (publiek, alleen namen), plus admin-varianten; `submitVote`, `listPolls` en admin-CRUD voor polls. Zod-validatie op alle invoer, naamlengte gelimiteerd, en rate-beperking via unieke constraints.
- Statusroute `src/routes/api/status.ts` geeft ook `version` en gemeten `ping` terug; `src/components/server-status.tsx` krijgt een uitgebreide variant.
- Nieuwe routes `src/routes/polls.tsx` met eigen SEO-metadata; kalender in `src/routes/events.tsx` zonder extra bibliotheek (eigen compacte maandweergave), mobiel-vriendelijk zoals de rest van de site.
- Admin-tabs voor RSVP's en polls in `src/routes/admin.tsx`, in dezelfde stijl als de bestaande tabs.
