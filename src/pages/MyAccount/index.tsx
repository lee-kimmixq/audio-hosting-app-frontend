import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import DeleteAccountDialog from './DeleteAccountDialog'
import { REACT_APP_BACKEND_URL } from '../../config'
import useFetch from '../../hooks/useFetch'

interface ChangePasswordPayload {
  newPassword: string
  confirmNewPassword: string
}

interface ChangePasswordResponse {
  changePassword: boolean
}

enum ChangePasswordError {
  SIGNUP_INVALID_PASSWORD = 'SIGNUP_INVALID_PASSWORD',
  BLANK_FIELD = 'BLANK_FIELD',
  UNKNOWN = 'UNKNOWN',
}

const errorMessageMap: { [x in ChangePasswordError]: string } = {
  [ChangePasswordError.SIGNUP_INVALID_PASSWORD]:
    'Please ensure that both passwords match',
  [ChangePasswordError.BLANK_FIELD]: 'Please fill in all fields',
  [ChangePasswordError.UNKNOWN]: 'An unknown error occurred',
}

export function MyAccount() {
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null)

  const [changePasswordError, setChangePasswordError] =
    useState<ChangePasswordError | null>(null)
  const [changePasswordSuccess, setChangePasswordSuccess] =
    useState<boolean>(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] =
    useState<boolean>(false)

  const {
    data: changePasswordResponse,
    renderFetch: changePassword,
    error: changePasswordResponseError,
    loading: changePasswordLoading,
  } = useFetch<ChangePasswordResponse, ChangePasswordPayload>(
    `${REACT_APP_BACKEND_URL}/user/change-password`,
    'PUT'
  )

  useEffect(() => {
    if (changePasswordLoading) return
    if (changePasswordResponse?.changePassword) {
      setChangePasswordSuccess(true)
      if (newPasswordRef.current && confirmNewPasswordRef.current) {
        newPasswordRef.current.value = ''
        confirmNewPasswordRef.current.value = ''
      }
      return
    }
    if (changePasswordResponseError) {
      setChangePasswordSuccess(false)
      setChangePasswordError(
        changePasswordResponseError?.code === 'AHA-SIGNUP-INVALID-PASSWORD'
          ? ChangePasswordError.SIGNUP_INVALID_PASSWORD
          : ChangePasswordError.UNKNOWN
      )
    }
  }, [
    changePasswordResponse,
    changePasswordResponseError,
    changePasswordLoading,
  ])

  const handleSubmit = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const newPassword = newPasswordRef.current?.value
    const confirmNewPassword = confirmNewPasswordRef.current?.value
    if (!newPassword || !confirmNewPassword) {
      setChangePasswordError(ChangePasswordError.BLANK_FIELD)
      return
    }

    setChangePasswordError(null)
    changePassword({ newPassword, confirmNewPassword })
  }, [])

  const handleOpenDialog = useCallback(() => {
    setDeleteAccountDialogOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setDeleteAccountDialogOpen(false)
  }, [])

  return (
    <>
      <Grid container justifyContent="center" my={10}>
        <Grid item container flexDirection="column" xs={6} rowGap={2}>
          <Typography variant="h4" textAlign="center">
            My Account
          </Typography>
          {changePasswordError && (
            <Alert severity="error">
              {errorMessageMap[changePasswordError]}
            </Alert>
          )}
          {changePasswordSuccess && (
            <Alert severity="success">Password successfully changed</Alert>
          )}
          <TextField
            required
            inputRef={newPasswordRef}
            label="New Password"
            type="password"
          />
          <TextField
            required
            inputRef={confirmNewPasswordRef}
            label="Confirm New Password"
            type="password"
          />
          <Button variant="contained" onClick={handleSubmit} type="submit">
            Change Password
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleOpenDialog}
          >
            Delete Account
          </Button>
        </Grid>
      </Grid>
      <DeleteAccountDialog
        open={deleteAccountDialogOpen}
        handleClose={handleCloseDialog}
      />
    </>
  )
}
