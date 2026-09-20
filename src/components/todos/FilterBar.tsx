import type { TodoFilter } from '@/types'
import { Button } from '@/components/ui/button'

interface FilterBarProps {
  activeFilter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
  remainingCount: number
  completedCount: number
  onClearCompleted: () => void
}

const filters: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

export function FilterBar({
  activeFilter,
  onFilterChange,
  remainingCount,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-1" role="group" aria-label="Todo filters">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          {remainingCount} left
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCompleted}
          disabled={completedCount === 0}
        >
          Clear completed ({completedCount})
        </Button>
      </div>
    </div>
  )
}

export default FilterBar
