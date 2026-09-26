export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
  }
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
}

export interface ShopProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
}

export interface DailyLog {
  id: string
  habit_id: string
  user_id: string
  log_date: string
  completed: boolean
  created_at: string
}

export interface HabitWithLogs extends Habit {
  daily_logs: DailyLog[]
}

export interface HabitInput {
  name: string
  description: string
}
