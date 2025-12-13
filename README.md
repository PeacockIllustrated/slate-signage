# Slate Signage

Agency-grade digital menu streaming platform.

## Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (Postgres)
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

3. **Database Setup**
   Run the SQL scripts located in `supabase/` to set up your database schema and seed data.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Architecture

- **Admin Portal**: `/app` (Protected)
- **Player**: `/player/[token]` (Public, Token-gated)
- **API**: `/api/*` (Ingest, Player Manifest, Signed URLs)

## Features

- **Batch Ingest**: Upload files named `screen_1_*.jpg` to automatically assign them to screens.
- **Real-time Updates**: Trigger refreshes from the dashboard to update players immediately (via polling).
- **Secure**: All media assets are served via signed URLs.
