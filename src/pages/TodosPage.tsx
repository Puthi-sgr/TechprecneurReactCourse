import { TodoApp } from '@/components/todos/TodoApp'
import { LiveStatus } from '@/components/LiveStatus'

export function TodosPage() {
  return (
    <div className="space-y-6">
      <LiveStatus />
      <TodoApp />
    </div>
  )
}

export default TodosPage
