import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import { REACT_APP_BACKEND_URL } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import useFetch from '../../hooks/useFetch'

interface DeleteAccountResponse {
  deleteAccount: boolean
}

enum DeleteAccountError {
  INVALID_OPERATION = 'INVALID_OPERATION',
  BLANK_FIELD = 'BLANK_FIELD',
  UNKNOWN = 'UNKNOWN',
}

const errorMessageMap: { [x in DeleteAccountError]: string } = {
  [DeleteAccountError.INVALID_OPERATION]: 'Invalid operation',
  [DeleteAccountError.BLANK_FIELD]: 'Please fill in your password',
  [DeleteAccountError.UNKNOWN]: 'An unknown error occurred',
}

interface DeleteAccountDialogProps {
  open: boolean
  handleClose: () => void
}

export default function DeleteAccountDialog({
  open,
  handleClose,
}: DeleteAccountDialogProps) {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const passwordRef = useRef<HTMLInputElement>(null)

  const [deleteAccountError, setDeleteAccountError] =
    useState<DeleteAccountError | null>(null)

  const {
    data,
    renderFetch: deleteAccount,
    error,
    loading,
  } = useFetch<DeleteAccountResponse>(
    `${REACT_APP_BACKEND_URL}/user/delete-account`,
    'DELETE'
  )

  useEffect(() => {
    if (loading) return
    if (data?.deleteAccount) {
      setAuth(false)
      navigate('/')
    }
    if (error) {
      setDeleteAccountError(
        error?.code === 'AHA-INVALID-OPERATION'
          ? DeleteAccountError.INVALID_OPERATION
          : DeleteAccountError.UNKNOWN
      )
      if (passwordRef.current) {
        passwordRef.current.value = ''
      }
    }
  }, [data, error, loading])

  const handleDelete = useCallback((event: any) => {
    event.preventDefault()

    const password = passwordRef.current?.value
    if (!password) {
      setDeleteAccountError(DeleteAccountError.BLANK_FIELD)
      return
    }

    setDeleteAccountError(null)
    deleteAccount({ password })
  }, [])

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          {deleteAccountError && (
            <Alert severity="error">
              {errorMessageMap[deleteAccountError]}
            </Alert>
          )}
          <DialogContentText>
            Please enter your password to proceed. This action is
            non-reversible.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            inputRef={passwordRef}
          />
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleDelete}>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
