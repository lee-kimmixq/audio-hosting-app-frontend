import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { REACT_APP_BACKEND_URL } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
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

const errorMessageMap: { [x in LoginError]: string } = {
  [LoginError.BLANK_FIELD]: 'Please fill in your username and password',
  [LoginError.INVALID]: 'Wrong username or password',
  [LoginError.UNKNOWN]: 'An unknown error occurred',
}

export function Home() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [loginError, setLoginError] = useState<LoginError | null>(null)

  const {
    data,
    renderFetch: login,
    error,
    loading,
  } = useFetch<LoginResponse, LoginPayload>(
    `${REACT_APP_BACKEND_URL}/user/login`,
    'POST'
  )

  useEffect(() => {
    if (loading) return
    if (data?.login) {
      setAuth(true)
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

  const handleSignup = useCallback(() => {
    navigate('/signup')
  }, [])

  return (
    <Grid container justifyContent="center" my={10}>
      <Grid item container flexDirection="column" xs={6} rowGap={2}>
        <Typography variant="h4" textAlign="center">
          Log In
        </Typography>
        {loginError && (
          <Alert severity="error">{errorMessageMap[loginError]}</Alert>
        )}
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
        <Button variant="outlined" onClick={handleSignup}>
          Don&apos;t have an account yet? Sign Up Here
        </Button>
      </Grid>
    </Grid>
  )
}
