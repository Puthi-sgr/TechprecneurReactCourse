import { Button } from '@/components/ui/button'

export function ShareButton() {
  const share = async () => {
    const shareData = { title: 'Habit Tracker', text: 'Build steady habits with me.', url: window.location.href }
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined)
      return
    }
    try {
      await navigator.clipboard.writeText(shareData.url)
      window.alert('Link copied to clipboard.')
    } catch {
      window.prompt('Copy this link:', shareData.url)
    }
  }
  return <Button type="button" variant="outline" onClick={() => void share()}>Share</Button>
}
