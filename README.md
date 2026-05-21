# Vibe Marketplace

Vibe is a Next.js marketplace for game creators to post paid streamer gigs and for streamers to apply, manage work, and track payouts.

## Local Testing

Use the local SQLite/libSQL database for development. You do not need Supabase for local testing.

```powershell
copy .env.example .env
npm.cmd install
node --experimental-require-module node_modules\prisma\build\index.js generate
npm.cmd run db:push
npm.cmd run db:seed
npm.cmd run build
npm.cmd run start
```

Open [http://localhost:3000](http://localhost:3000).

The Prisma CLI currently needs the `node --experimental-require-module ... generate` command on Node 22.2.0 in this environment. If `npm.cmd run db:generate` works on your Node version, that script is fine too.

## Database

Local development uses:

```env
DATABASE_URL="file:./dev.db"
```

For production, use a hosted database. The current code is wired for SQLite/libSQL, so Turso/libSQL is the lowest-friction hosted option. Supabase is Postgres, so using Supabase would require changing the Prisma datasource provider and validating the schema/migrations against Postgres.

## OAuth

Twitch and YouTube login require provider credentials in `.env`:

```env
TWITCH_CLIENT_ID=""
TWITCH_CLIENT_SECRET=""
YOUTUBE_CLIENT_ID=""
YOUTUBE_CLIENT_SECRET=""
```

Kick is not included in the installed NextAuth provider package. It needs a custom OAuth provider plus database fields before it should appear as a verified connection option.
