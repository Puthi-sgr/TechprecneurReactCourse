export function SupabaseSetupNotice() {
  return (
    <div
      role="alert"
      className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900"
    >
      <h2 className="text-base font-semibold">Supabase is not configured yet</h2>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
        <li>Create a project at supabase.com (see SETUP.md, step 1).</li>
        <li>
          Copy your project URL and anon key into the{' '}
          <code className="rounded bg-amber-100 px-1 font-mono">.env</code> file.
        </li>
        <li>Restart the dev server and reload this page.</li>
      </ol>
    </div>
  )
}
