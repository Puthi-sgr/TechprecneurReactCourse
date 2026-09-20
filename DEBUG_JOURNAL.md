# Debugging journal — three-bug hunt

Bugs were planted in commit `7b9f042` (fixed in the following commit). Between planting
and hunting I stepped away for ten minutes so I would investigate symptoms cold, with
tools instead of guesses. Note: `vite dev` strips types without typechecking, so all
three bugs ran at runtime even though `tsc` is strict.

## Bug 1 — crash: `.filter()` on null state

- **Symptom:** blank page on load; console shows `TypeError: Cannot read properties of null (reading 'filter')` pointing at `App.tsx`.
- **Tool:** Chrome DevTools **breakpoint** — Sources tab, "Pause on uncaught exception" (or click `App.tsx:19` in the console stack trace).
- **What it showed:** execution stopped inside `App` right before `products.filter(...)`; the **Scope panel** listed `products: null`, and the **Call Stack** confirmed we were in the component's initial render, before any `setProducts` call ever ran.
- **Fix:** initialize the state with the seed data — `useState<Product[]>(initialProducts)` instead of `useState<Product[] | null>(null)`. The `useState<Product[]>(...)` type signature also makes the null variant a compile error from now on.

## Bug 2 — silent wrong value: prop name typo

- **Symptom:** no crash, but the catalog section header was silently blank while the "Add product" section still had its heading.
- **Tool:** **React DevTools** — Components tab, selected the first `<Section>` in the tree.
- **What it showed:** the props panel read `titel: "Catalog"` and `title: undefined` — the parent was passing a prop the child never reads. (Running `npm run typecheck` afterwards also flags it: `Object literal may only specify known properties, 'titel'` — which is exactly why prop interfaces exist.)
- **Fix:** rename `titel` → `title` in `App.tsx` so it matches `SectionProps`.

## Bug 3 — network failure: mistyped URL

- **Symptom:** clicking "Load sample products" showed the red error `Request failed with status 404` every time.
- **Tool:** Chrome **Network tab**, filtered to Fetch/XHR, then clicked the button again.
- **What it showed:** one request to `fakestoreapi.com/productz` with **status 404**, while typing the correct `products` path into the address bar returned 200 with JSON — the endpoint was healthy, my URL was wrong.
- **Fix:** correct the URL to `https://fakestoreapi.com/products?limit=3`; the request then returns 200 and the samples render.

## What the hunt reinforced

Each bug was found by a tool matched to its failure mode: a **breakpoint** for a crash
(state inspection at the moment of failure), **React DevTools** for a silent prop
mismatch, and the **Network tab** for anything involving a server. The type system
(`tsc`, prop interfaces) would have prevented two of the three at compile time — which
is the whole point of typing end to end.
