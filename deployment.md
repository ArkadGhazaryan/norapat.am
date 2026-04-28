# Deployment Checklist

## Local

```powershell
npm.cmd run db:init
npm.cmd run check
npm.cmd run dev
```

## Vercel

1. Import the Git repository in Vercel.
2. Set build command to `npm run build`.
3. Set environment variables:
   - `ADMIN_PASSWORD`
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `PAYMENT_PROVIDER`
   - `UPLOAD_PROVIDER`
4. For production, move local SQLite data to a managed PostgreSQL provider such as Supabase or Neon.
5. Use the same server-side API contracts for orders, products, customers and promos.

## QA

Run before deployment:

```powershell
npm.cmd run qa
```

The QA script initializes the database, checks required project files and builds the app.
