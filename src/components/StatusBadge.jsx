/**
 * StatusBadge Component
 * Uses a ternary operator to show "Open to work" (green) or "Busy learning" (gray) from prop.
 */
export function StatusBadge({ isOpenToWork = true }) {
  return (
    <span className={`status-badge ${isOpenToWork ? 'open' : 'busy'}`}>
      <span className="status-dot" />
      {isOpenToWork ? 'Open to work' : 'Busy learning'}
    </span>
  )
}

export default StatusBadge
