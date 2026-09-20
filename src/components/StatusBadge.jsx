/**
 * StatusBadge Component
 * Uses a ternary operator to show "Open to work" (green) or "Busy learning" (gray) from prop.
 * Styled with Tailwind CSS.
 */
export function StatusBadge({ isOpenToWork = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        isOpenToWork
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-gray-100 text-gray-600 border-gray-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOpenToWork ? 'bg-emerald-500' : 'bg-gray-400'
        }`}
      />
      {isOpenToWork ? 'Open to work' : 'Busy learning'}
    </span>
  )
}

export default StatusBadge
