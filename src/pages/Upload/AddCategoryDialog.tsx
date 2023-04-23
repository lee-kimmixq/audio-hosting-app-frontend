import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import { REACT_APP_BACKEND_URL } from '../../config'
import useFetch from '../../hooks/useFetch'
import { Category } from '../../types/shared'

interface AddCategoryResponse {
  category: Category
}

enum AddCategoryError {
  UNKNOWN = 'UNKNOWN',
  BLANK_FIELD = 'BLANK_FIELD',
}

const errorMessageMap: { [x in AddCategoryError]: string } = {
  [AddCategoryError.UNKNOWN]: 'An unknown error occurred',
  [AddCategoryError.BLANK_FIELD]: 'Please fill in the new category name',
}

interface AddCategoryDialogProps {
  open: boolean
  handleClose: () => void
}

export default function AddCategoryDialog({
  open,
  handleClose,
}: AddCategoryDialogProps) {
  const nameRef = useRef<HTMLInputElement>(null)

  const [addCategoryError, setAddCategoryError] =
    useState<AddCategoryError | null>(null)

  const {
    data,
    renderFetch: addCategory,
    error,
    loading,
  } = useFetch<AddCategoryResponse, { name: string }>(
    `${REACT_APP_BACKEND_URL}/category/new`,
    'POST'
  )

  useEffect(() => {
    if (loading) return
    if (data?.category) {
      handleClose()
    }
    if (error) {
      setAddCategoryError(AddCategoryError.UNKNOWN)
    }
  }, [data, error, loading])

  const handleSubmit = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const name = nameRef.current?.value
    if (!name) {
      setAddCategoryError(AddCategoryError.BLANK_FIELD)
      return
    }

    setAddCategoryError(null)
    addCategory({ name })
  }, [])

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          {addCategoryError && (
            <Alert severity="error">{errorMessageMap[addCategoryError]}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            inputRef={nameRef}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleSubmit}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
