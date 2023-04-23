import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { REACT_APP_BACKEND_URL } from '../../config'
import useFetch from '../../hooks/useFetch'

interface SignupPayload {
  username: string
  password: string
  confirmPassword: string
}

interface SignupResponse {
  signup: boolean
}

enum SignupError {
  SIGNUP_INVALID_PASSWORD = 'SIGNUP_INVALID_PASSWORD',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  BLANK_FIELD = 'BLANK_FIELD',
  UNKNOWN = 'UNKNOWN',
}

const errorMessageMap: { [x in SignupError]: string } = {
  [SignupError.SIGNUP_INVALID_PASSWORD]:
    'Please ensure that both passwords match',
  [SignupError.USERNAME_ALREADY_EXISTS]:
    'This username is taken, please choose another username',
  [SignupError.BLANK_FIELD]: 'Please fill in all fields',
  [SignupError.UNKNOWN]: 'An unknown error occurred',
}

export function Signup() {
  const navigate = useNavigate()

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const [signupSuccess, setSignupSuccess] = useState<boolean>(false)
  const [signupError, setSignupError] = useState<SignupError | null>(null)

  const {
    data,
    renderFetch: signup,
    error,
    loading,
  } = useFetch<SignupResponse, SignupPayload>(
    `${REACT_APP_BACKEND_URL}/user/signup`,
    'POST'
  )

  useEffect(() => {
    if (loading) return
    if (data?.signup) {
      setSignupSuccess(true)
    }
    if (error) {
      setSignupSuccess(false)
      if (error.code === 'AHA-SIGNUP-INVALID-PASSWORD') {
        setSignupError(SignupError.SIGNUP_INVALID_PASSWORD)
        return
      }
      if (error.code === 'AHA-USERNAME-ALREADY-EXISTS') {
        setSignupError(SignupError.USERNAME_ALREADY_EXISTS)
        return
      }
      setSignupError(SignupError.UNKNOWN)
    }
  }, [data, error, loading])

  const handleSubmit = useCallback((event: any) => {
    event.preventDefault()

    const username = usernameRef.current?.value
    const password = passwordRef.current?.value
    const confirmPassword = confirmPasswordRef.current?.value
    if (!username || !password || !confirmPassword) {
      setSignupError(SignupError.BLANK_FIELD)
      return
    }

    setSignupError(null)
    signup({ username, password, confirmPassword })
  }, [])

  const handleLogin = useCallback(() => {
    navigate('/')
  }, [])

  return (
    <Grid container justifyContent="center" my={10}>
      <Grid item container flexDirection="column" xs={6} rowGap={2}>
        <Typography variant="h4" textAlign="center">
          Sign Up
        </Typography>
        {signupSuccess && (
          <Alert severity="success">Signed up succesfully</Alert>
        )}
        {signupError && (
          <Alert severity="error">{errorMessageMap[signupError]}</Alert>
        )}
        <TextField required inputRef={usernameRef} label="Username" />
        <TextField
          required
          inputRef={passwordRef}
          label="Password"
          type="password"
        />
        <TextField
          required
          inputRef={confirmPasswordRef}
          label="Confirm Password"
          type="password"
        />
        <Button variant="contained" onClick={handleSubmit} type="submit">
          Sign Up
        </Button>
        <Button variant="outlined" onClick={handleLogin}>
          Already have an account? Log In Here
        </Button>
      </Grid>
    </Grid>
  )
}
