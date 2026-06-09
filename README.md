# Helios

Helios is a jewelry storefront with a React frontend and a NestJS backend. It supports product browsing, product detail pages, user login/register, admin-only jewelry management, multi-image jewelry media with thumbnail and sort order, and a backend-backed cart per user.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Zustand, Tailwind CSS
- Backend: NestJS, Prisma, PostgreSQL
- Media upload: Cloudinary
- Database/runtime: PostgreSQL, Docker Compose

## Project Structure

```text
helios/
  backend/            NestJS API, Prisma schema, migrations
  frontend/           React storefront and admin UI
  docker-compose.yml  PostgreSQL and backend services
```

## Prerequisites

- Node.js
- npm
- Docker Desktop, optional but recommended for PostgreSQL
- Cloudinary account for jewelry image upload

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=""

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

CORS_ORIGINS=
PORT=
```

Create `frontend/.env`:

```env
VITE_API_URL=
```

## Database Setup

Start PostgreSQL with Docker:

```bash
docker compose up -d postgres
```

The local database URL is:

```text
postgresql://postgres:123456@localhost:5432/postgres
```

Run Prisma migrations and generate the Prisma client:

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
```

For development, you can also use:

```bash
npx prisma migrate dev
```

## Run Locally

Start the backend:

```bash
cd backend
npm install
npm run start:dev
```

Backend API:

```text
http://localhost:3000/api/v1
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend app:

```text
http://localhost:5173
```

## Run With Docker

Build and run the Docker services:

```bash
docker compose up --build
```

This starts PostgreSQL and the backend. The backend service uses the internal Docker database URL:

```text
postgresql://postgres:123456@postgres:5432/postgres
```

## Main Features

- Home page with API-loaded jewelry products
- Product catalog with type filtering
- Product detail page with image gallery
- Login and register pages
- Language switcher for English and Vietnamese
- Footer with customer, company, and social sections
- Backend-backed cart for logged-in users
- Admin-only `/admin` route
- Admin jewelry list with pagination, edit, delete, and add actions
- Jewelry form with multiple images, thumbnail selection, image sort order, and file size validation

## Admin Access

Registered accounts are created as normal users by default. Normal users cannot access `/admin`.

To promote a user to admin, update the role in PostgreSQL:

```sql
UPDATE "User"
SET "role" = 'ADMIN'
WHERE "email" = 'admin@example.com';
```

After changing the role, log out and log in again so the frontend stores the updated user role.

## API Summary

Base URL:

```text
http://localhost:3000/api/v1
```

User endpoints:

```text
POST /users
POST /users/login
```

Jewelry endpoints:

```text
GET    /jewelry
POST   /jewelry
GET    /jewelry/:id
PATCH  /jewelry/:id
DELETE /jewelry/:id
GET    /jewelry/slug/:slug
POST   /jewelry/upload
```

Cart endpoints:

```text
GET    /cart/:userId
POST   /cart/:userId/items
PATCH  /cart/:userId/items/:jewelryId
DELETE /cart/:userId/items/:jewelryId
DELETE /cart/:userId
```

Current cart access is tied to the `userId` route parameter. The frontend blocks anonymous users from adding products to the cart, but the backend does not yet use JWT/session auth.

## Jewelry Types

The product menu and admin form support jewelry categories such as:

- Silver ring
- Silver bracelet
- Silver necklace
- Silver pendant
- Silver charm
- Silver earrings
- Gold jewelry
- Glasses
- Leather craft
- Other

## Build And Check

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Troubleshooting

If the backend shows `Can't reach database server at localhost:5432`, start PostgreSQL first:

```bash
docker compose up -d postgres
```

If the browser shows a CORS error, make sure `backend/.env` includes the frontend origin:

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

If `prisma generate` fails on Windows with an `EPERM` error for the query engine DLL, stop the running backend Node process and run it again:

```bash
cd backend
npx prisma generate
```

If jewelry image upload fails, confirm the Cloudinary variables in `backend/.env` are valid.
