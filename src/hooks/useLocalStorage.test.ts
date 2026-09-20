import { act, renderHook } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

const KEY = 'test-key'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage(KEY, 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  it('persists a new value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<string>(KEY, ''))

    act(() => result.current[1]('persisted'))
    expect(result.current[0]).toBe('persisted')
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify('persisted'))
  })

  it('restores the stored value after a "refresh" (remount)', () => {
    const first = renderHook(() => useLocalStorage<string>(KEY, ''))
    act(() => first.result.current[1]('survives'))
    first.unmount()

    const second = renderHook(() => useLocalStorage<string>(KEY, ''))
    expect(second.result.current[0]).toBe('survives')
  })
})
