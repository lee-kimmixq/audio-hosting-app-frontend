import { useEffect, useRef, useState } from 'react'

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

class FetchError extends Error {
  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, FetchError.prototype)
  }
}

interface CustomError {
  httpCode: number
  code: string
  message: string
}

export default function useFetch<T, S = {}>(
  url: string,
  method: FetchMethod,
  headers?: {}
) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<CustomError | null>(null)
  const [loading, setLoading] = useState(false)
  const fetchCount = useRef<number>(0)
  const [body, setBody] = useState<string>()
  const [success, setSuccess] = useState<boolean>(false)
  const [queryParams, setQueryParams] = useState<{ [x: string]: string }>()

  const renderFetch = (payload?: S, query?: { [x: string]: string }) => {
    if (payload) setBody(JSON.stringify(payload))
    setQueryParams(query || undefined)

    fetchCount.current += 1
  }

  const clearError = () => setError(null)

  useEffect(() => {
    ;(async () => {
      if (fetchCount.current === 0) return false
      setSuccess(false)
      setLoading(true)
      return true
    })()
  }, [fetchCount.current])

  useEffect(() => {
    ;(async () => {
      if (!loading) return false
      try {
        setData(undefined)
        setError(null)
        const delimiter = url.includes('?') ? '&' : '?'
        const urlQueryParams = queryParams
          ? `${delimiter}${new URLSearchParams(queryParams)}`
          : ''
        const response = await fetch(`${url}${urlQueryParams}`, {
          method,
          body: method === 'GET' ? undefined : body,
          headers: {
            ...DEFAULT_HEADERS,
            ...headers,
          },
          credentials: 'include',
        })
        setSuccess(response?.ok)
        if (response?.ok) {
          if (response?.status === 200) {
            const responseData: T | any = await response?.json()
            setData(responseData)
          }
        } else {
          const errorText = await response?.text()
          throw new FetchError(errorText)
        }
      } catch (err) {
        setError(err instanceof FetchError ? JSON.parse(err.message) : err)
      } finally {
        setLoading(false)
        setBody(undefined)
      }
      return true
    })()
  }, [loading])

  return { data, error, loading, fetchCount, renderFetch, clearError, success }
}
