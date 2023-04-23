import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import useFetch from '../../hooks/useFetch'

interface LoginPayload {
  username: string
  password: string
}

interface LoginResponse {
  login: boolean
}

enum LoginError {
  BLANK_FIELD = 'BLANK_FIELD',
  INVALID = 'INVALID',
  UNKNOWN = 'UNKNOWN',
}

export function Home() {
  const navigate = useNavigate()

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [loginError, setLoginError] = useState<LoginError | null>(null)

  const {
    data,
    renderFetch: login,
    error,
    loading,
  } = useFetch<LoginResponse, LoginPayload>(
    `${process.env.REACT_APP_BACKEND_URL}/user/login`,
    'POST'
  )

  useEffect(() => {
    if (loading) return
    if (data?.login) {
      navigate('/dashboard')
    }
    if (error) {
      setLoginError(
        error?.code === 'AHA-INVALID-LOGIN'
          ? LoginError.INVALID
          : LoginError.UNKNOWN
      )
    }
  }, [data, error, loading])

  const handleSubmit = useCallback((event: any) => {
    event.preventDefault()

    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    if (!username || !password) {
      setLoginError(LoginError.BLANK_FIELD)
      return
    }

    setLoginError(null)
    login({ username, password })
  }, [])

  return (
    <>
      {loginError && loginError}
      <TextField required inputRef={usernameRef} label="Username" />
      <TextField
        required
        inputRef={passwordRef}
        label="Password"
        type="password"
      />
      <Button variant="contained" onClick={handleSubmit} type="submit">
        Log In
      </Button>
    </>
  )
}
