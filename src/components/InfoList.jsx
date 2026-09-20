export function InfoList({ items = [] }) {
  return (
    <ul className="list-none divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white p-0">
      {items.map((item) =>
        item.href ? (
          <li key={item.label}>
            <a
              href={item.href}
              className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-200"
            >
              <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                {item.label}
              </span>
              <span className="text-sm text-gray-500 transition-colors duration-200 group-hover:text-blue-600">
                {item.detail}
              </span>
            </a>
          </li>
        ) : (
          <li key={item.label} className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-sm text-gray-500">{item.detail}</span>
          </li>
        )
      )}
    </ul>
  )
}

export default InfoList
