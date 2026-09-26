import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function UpdateToast() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    let active = true
    const watchRegistration = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        if (active) setWaitingWorker(registration.waiting)
      }
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing
        if (!installing) return
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller && active) {
            setWaitingWorker(installing)
          }
        })
      })
    }
    void navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration && active) watchRegistration(registration)
    })
    const handleControllerChange = () => window.location.reload()
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
    return () => {
      active = false
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  if (!waitingWorker) return null
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-900 px-4 py-3 text-white shadow-xl" role="status">
      <span className="font-medium">New version available</span>
      <Button type="button" variant="secondary" onClick={() => waitingWorker.postMessage({ type: 'SKIP_WAITING' })}>Refresh</Button>
    </div>
  )
}
