# MMA SRB Platform (Monorepo)

Full‑stack starter for a Balkan MMA hub: Next.js web app, shared Prisma/PostgreSQL DB, ingest worker for news/events, and a Python FastAPI microservice for predictions.

## What’s inside
- apps/web: Next.js (React + TS) with basic pages (Home, Fighters, Events, News, Live, Forum) and a health API route.
- packages/db: Prisma schema + client for PostgreSQL.
- services/ingest: TypeScript worker that pulls MMA news via RSS and stores them in DB (runs on interval).
- services/predictor: Python FastAPI with a dummy /predict endpoint (to be replaced by a trained model).
- docker-compose: Local Postgres + Redis (optional for future queues).

## Quick start

1) Prereqs
- Node.js 18+ and npm
- Python 3.10+
- (Optional) Docker Desktop for Postgres/Redis

2) Configure environment
- Copy env templates and adjust values

```powershell
Copy-Item .env.example .env
Copy-Item apps/web/.env.example apps/web/.env.local
Copy-Item services/ingest/.env.example services/ingest/.env
```

If using Docker for DB/Redis:
```powershell
docker compose up -d
```

3) Install deps (workspaces)
```powershell
npm install
```

4) Initialize database (Prisma)
```powershell
npm run db:generate
npm run db:push
```

5) Run services
- Web (Next.js):
```powershell
npm run dev:web
```
- Ingest worker (RSS -> DB):
```powershell
npm run dev:worker
```
- Predictor (Python FastAPI):
```powershell
python -m uvicorn services.predictor.main:app --reload --host 127.0.0.1 --port 8001
```

Open http://localhost:3000
- Health check: http://localhost:3000/api/health

## Environment
Root `.env` (used by Prisma):
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mmasrb?schema=public
REDIS_URL=redis://localhost:6379
```

Web `.env.local` (Next.js):
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Ingest `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mmasrb?schema=public
RSS_SOURCES=https://www.mmafighting.com/rss/index.xml,https://www.mmamania.com/rss,https://www.mmajunkie.usatoday.com/feed
FETCH_INTERVAL_MS=900000
```

## Notes and next steps
- Data model: currently includes NewsItem. Extend with Fighter, Organization, Event, Bout, Prediction, User.
- Scraping: favor official APIs/RSS. Respect robots.txt and ToS.
- AI: swap the dummy predictor for a real model (XGBoost/LightGBM). Add feature store and model registry.
- Forum: integrate Discourse/NodeBB via SSO or build custom in web app.
- Real‑time: add WebSocket/SSE for live text feed and chats.
- Search: add Meilisearch/Elasticsearch for fast search/autocomplete.

## License
Private starter. Add a proper license before public release.