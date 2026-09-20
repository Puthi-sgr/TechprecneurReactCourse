export function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default Section
