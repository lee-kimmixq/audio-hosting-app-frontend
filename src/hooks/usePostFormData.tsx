import { useEffect, useRef, useState } from 'react'

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

export default function usePostFormData<T>(url: string) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<CustomError | null>(null)
  const [loading, setLoading] = useState(false)
  const fetchCount = useRef<number>(0)
  const [body, setBody] = useState<FormData>()
  const [success, setSuccess] = useState<boolean>(false)

  const renderFetch = (payload?: FormData) => {
    if (payload) setBody(payload)
    console.log(payload)
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
      console.log(body)
      try {
        setData(undefined)
        setError(null)
        const response = await fetch(url, {
          method: 'POST',
          body: body as any,
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
