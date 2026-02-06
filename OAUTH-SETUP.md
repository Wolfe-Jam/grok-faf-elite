# GitHub OAuth Setup for 1-Click FAF

## Step 1: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `FAF Builder`
   - **Homepage URL**: `https://builder.faf.one`
   - **Authorization callback URL**: `https://builder.faf.one/auth/callback`
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy it

## Step 2: Add Environment Variables

Create `.env` file in project root:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

**For production (Vercel):**

1. Go to Vercel dashboard → Project Settings → Environment Variables
2. Add:
   - `GITHUB_CLIENT_ID` = your_client_id
   - `GITHUB_CLIENT_SECRET` = your_client_secret

Also add to frontend (for OAuth redirect):
   - `VITE_GITHUB_CLIENT_ID` = your_client_id

## Step 3: Test Locally

```bash
npm run dev
```

1. Visit http://localhost:5173
2. Enter a repo URL that has no project.faf
3. Click "Add project.faf →"
4. Should redirect to GitHub OAuth
5. Authorize the app
6. Should create project.faf and commit to repo

## Step 4: Deploy to Vercel

```bash
git add .
git commit -m "feat: Add 1-Click project.faf generation"
git push
```

Vercel will auto-deploy with the environment variables.

## How It Works

```
User clicks "Add project.faf"
    ↓
OAuth: GitHub authorization (scope: repo)
    ↓
Callback: /auth/callback receives code
    ↓
API: /api/add-faf
    1. Exchange code for token
    2. Fetch README + package.json
    3. Run: faf init
    4. Run: faf readme --apply
    5. Commit project.faf via GitHub API
    ↓
Done! Repo now has project.faf ✅
```

## Permissions

The app requests `repo` scope which allows:
- Read repository contents (README, package.json)
- Write files (project.faf)
- Commit changes

Users see exactly what we're requesting during OAuth flow.

## Security

- Client secret is server-side only (never exposed to browser)
- Access tokens are used once and not stored
- Temp directories are cleaned up after each generation
- All operations happen on Vercel serverless functions (ephemeral)

---

**1-Click. Million repos. Zero friction.**
