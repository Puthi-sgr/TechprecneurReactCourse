# Deploy the web app to Vercel

1. Push this repository to GitHub, then import `Puthi-sgr/TechprecneurReactCourse` in Vercel.
2. Keep the project root at the repository root. `vercel.json` sets `npm run build`, `dist`, and the React Router fallback.
3. In Vercel **Settings → Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production (and Preview if needed). Use the Supabase project URL and anon/publishable key; do not add the service-role key.
4. Deploy, then redeploy after setting the variables because Vite embeds these public client values at build time.
5. Open the HTTPS deployment, sign in, add a habit, refresh, and confirm that the habit remains.

The deployment cannot be completed from this workspace until changes are pushed and a Vercel project/account is connected. No Vercel CLI or authenticated Vercel session is available here.

## Expo app

```sh
cd expo-app
npm install
npx expo start
```

`expo-app/.env` is gitignored and is already populated from the ignored web `.env` in this workspace. Use Node 22.13+ or 24.3+ before installing; the installed Node 23.3 is unsupported by this Expo/React Native SDK. Scan the QR code with Expo Go or press `a` / `i` for an available emulator. The dependency install here failed with an npm network reset, so the Expo app has not been run in this workspace.
