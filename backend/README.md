# Backend — ClothSwap

Quick start and dev notes for the backend service.

Prerequisites
- Node.js (16+ recommended)
- MongoDB (local or remote) — set `MONGO_URI` in `backend/.env`

Setup
1. Install dependencies:
```bash
cd backend
npm install
```

2. Copy `backend/.env.example` to `backend/.env` and fill real values.

Running
- Development (auto-restarts): `npm run dev`
- Production: `npm start`

Seeding sample data
```bash
cd backend
# run the seed script (will connect to DB using MONGO_URI)
node seeds/seed.js
```

Endpoints (examples)
- Health: `GET /` → responds "Backend Running"
- Register: `POST /api/users/register`
- Login: `POST /api/users/login`
- Clothes: `GET /api/clothes`, `POST /api/clothes`
- Swap requests: `GET /api/swapRequests`, `POST /api/swapRequests`

Notes
- Keep `backend/.env` out of source control. Use `backend/.env.example` as a template.
