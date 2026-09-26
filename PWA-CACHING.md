# PWA caching and audit notes

## Caching choices

- **App shell and hashed JS/CSS:** precache the shell; Vite emits hashed bundles. These assets define the app needed to open a route offline.
- **Navigation:** network-first with the last successful app shell as fallback. This favors fresh page code while preserving an offline entry point.
- **Images:** cache-first with a network fill. Images are reusable and should not block a screen while checking the network.
- **Remote API requests:** network-only. Product and API data changes; stale responses could mislead. Habit writes are queued locally.
- **Supabase auth and storage writes:** network-only. Auth and writes must reach Supabase; queued habit inserts retry after reconnect.

## Offline habits

New habits created while `navigator.onLine` is false are stored in IndexedDB and shown with a **Queued** badge. On the `online` event the tracker inserts each queued habit for the active user, removes successful entries, and reloads the server list. Supabase login is still required before accessing the tracker.

## Production verification

Build and serve the production bundle before testing service-worker behavior:

```sh
npm run build
npm run preview
```

The service worker is in `public/sw.js`, so no dev-server worker is registered. The current environment did not have network access to install `vite-plugin-pwa`; the worker and install/update UI use browser APIs directly. To align with the lesson's required `registerType: "prompt"` and `useRegisterSW` API, install `vite-plugin-pwa` when npm registry access is available and migrate registration to `virtual:pwa-register/react`.

Lighthouse scores, HTTPS install eligibility, and phone/tablet screenshots must be recorded from the deployed HTTPS URL or local production preview after opening it in a browser. No scores are claimed here because Lighthouse and browser tooling are not available in this workspace.
