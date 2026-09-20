import { useEffect, useState } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setData(null)

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json() as Promise<T>
      })
      .then((json) => {
        if (cancelled) return
        setData(json)
        setLoading(false)
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setError(
          cause instanceof Error ? cause.message : 'Request failed.',
        )
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return { data, loading, error }
}
