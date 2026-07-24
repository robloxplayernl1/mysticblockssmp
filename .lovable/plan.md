## Bedrock status verwijderen

De homepage toont nu twee losse status-indicators (Java + Bedrock), maar het is dezelfde server. Ik haal de Bedrock-status weg en houd één live status over.

### Wijzigingen

- `src/components/server-status.tsx`: alleen Java-status tonen (één indicator met spelersaantal), Bedrock-weergave verwijderen.
- `src/routes/api/status.ts`: Bedrock-fetch weglaten, alleen Java-status ophalen en teruggeven (cache blijft 30s).
- `src/routes/index.tsx`: geen aparte "Bedrock" statusweergave meer — de "Hoe join je?" sectie met Java + Bedrock instructies blijft ongewijzigd staan.
