import { useEffect, useState } from 'react'

export function LiveStatus() {
  const [width, setWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const breakpoint =
    width < 640 ? 'phone' : width < 1024 ? 'tablet' : 'desktop'

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
      <span className="inline-block size-2 animate-pulse rounded-full bg-green-500" />{' '}
      Live viewport: <span className="font-semibold text-gray-900">{width}px</span>{' '}
      ({breakpoint})
    </div>
  )
}

export default LiveStatus
