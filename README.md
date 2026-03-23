# Water Tracker

A web application for tracking and managing daily water consumption. Users can log water usage by category, view dashboards with daily and weekly summaries, and receive alerts when exceeding their daily limit.

**Live demo:** https://watertracker-liard.vercel.app

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, React Router
- **Backend:** Node.js, Express 5, TypeScript
- **Database:** PostgreSQL (hosted on Neon)
- **Auth:** Clerk
- **ORM:** Prisma 7
- **Deployment:** Vercel (frontend), Render (backend)

## Setup Instructions

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted, e.g. Neon)
- Clerk account (for authentication keys)

### 1. Clone the repository

```bash
git clone https://github.com/grz3chotnik/watertracker.git
cd watertracker
```

### 2. Frontend setup

```bash
npm install
```

Create a `.env` file in the root directory:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3001/api
```

### 3. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```
DATABASE_URL=your_postgresql_connection_string
PORT=3001
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Database setup

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

## Running the App

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend (in a separate terminal):

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:3001`.

## Assumptions & Limitations

- Authentication is handled by Clerk — there is no custom email/password system. Users sign up and log in through Clerk's hosted UI.
- The daily water usage limit is hardcoded at 150 liters. It is not configurable per user through the UI.
- Water usage dates are stored as strings (YYYY-MM-DD) and are based on the user's local timezone.
- The "Others" usage type allows custom labels, but they are grouped under "Others" in the dashboard category breakdown.
- The free tier of Render may cause the backend to spin down after inactivity, resulting in a short delay on the first request.
