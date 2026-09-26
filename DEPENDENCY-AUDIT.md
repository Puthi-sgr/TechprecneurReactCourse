# Performance and dependency audit

## Route split

`/shop` is loaded with `React.lazy` because it is a secondary destination with product fetching, cart, checkout form, and their component code. The habit tracker and its sign-in screens now load only when requested. A shared `Suspense` fallback covers route chunks while they arrive.

## Dependency removed

Removed `@base-ui/react` from the web app. It was used only to render the design-system button; a native HTML `<button>` preserves the same `type`, disabled, click, focus, and accessibility behavior with fewer runtime dependencies. The existing class-variance-authority styling remains.

## Chunk sizes

Measured with `npm run build` (Vite output, uncompressed):

| Output | Before | After |
| --- | ---: | ---: |
| Initial JavaScript | 565.55 kB | 299.77 kB (gzip 97.71 kB) |
| Initial CSS | 40.27 kB | 41.51 kB (gzip 8.49 kB) |
| Route chunks emitted after split | 0 | 283.79 kB total |

The initial JavaScript fell by **265.78 kB (47.0%)**. Route chunks load on demand. The 260.39 kB emitted route total is mostly the 239.96 kB tracker/auth chunk; it does not load on the shop route. The old bundle did not report gzip size, so this report does not invent a before gzip comparison.

## Expo project

The `expo-app` project uses Expo SDK 57 with NativeWind 4.2.7 and shares `shared/habitLogic.ts` with the web app. Supabase values belong in `expo-app/.env` under `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; do not commit that file. Use Node 22.13+ or 24.3+ (the installed Node 23.3 is unsupported by this Expo SDK). Expo package choices follow the current [Expo project guide](https://docs.expo.dev/get-started/create-a-project/), [NativeWind installation guide](https://www.nativewind.dev/docs/getting-started/installation), and [Supabase Expo quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native).
