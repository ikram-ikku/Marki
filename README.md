# Marki

Marki is organized as two independent applications:

- `frontend/` contains the Vite and React client.
- `backend/` contains the Express API and Prisma configuration.

## Run locally

Install each application's dependencies from its own directory if `node_modules` is not already present.

```sh
cd backend
npm run dev
```

In a separate terminal:

```sh
cd frontend
npm run dev
```

The frontend development server proxies `/api` requests to `http://localhost:5000`.
The backend permits requests from `http://localhost:5173` by default; set `CORS_ORIGIN` in `backend/.env` when using a different client origin.
