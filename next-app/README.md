# Football News (Next.js)

This is a scaffolded demo of a Football News website using Next.js, TypeScript, Tailwind CSS, Prisma and NextAuth.

Quick start

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `NEXTAUTH_SECRET` (and GitHub creds if using GitHub auth).

2. From `next-app/` install dependencies:

```bash
cd next-app
npm install
# or yarn
```

3. Initialize the database and generate Prisma client:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed --preview-feature # or npm run prisma:seed if configured
```

4. Run the development server:

```bash
npm run dev
```

Notes:
- This scaffold includes a NextAuth route using the Prisma adapter; configure providers with env vars.
- Seed script `prisma/seed.ts` creates demo user/articles.
