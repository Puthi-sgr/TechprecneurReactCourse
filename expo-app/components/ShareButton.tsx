import { Button, Platform, Share } from 'react-native'

const shareHabitTracker = Platform.select({
  web: async () => {
    const url = window.location.href
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title: 'Habit Tracker', text: 'Build steady habits with me.', url })
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        if (typeof window !== 'undefined') window.prompt('Copy this link:', url)
      }
    } else if (typeof window !== 'undefined') {
      window.prompt('Copy this link:', url)
    }
  },
  default: async () => {
    await Share.share({ message: 'Build steady habits with me.', title: 'Habit Tracker' })
  },
})

export function ShareButton() {
  return <Button title="Share" onPress={() => void shareHabitTracker?.()} />
}
