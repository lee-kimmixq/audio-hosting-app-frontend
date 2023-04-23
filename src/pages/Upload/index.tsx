import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import AddIcon from '@mui/icons-material/Add'
import AudioFileIcon from '@mui/icons-material/AudioFile'
import UploadIcon from '@mui/icons-material/Upload'

import AddCategoryDialog from './AddCategoryDialog'
import { REACT_APP_BACKEND_URL } from '../../config'
import useFetch from '../../hooks/useFetch'
import { Category } from '../../types/shared'
import usePostFormData from '../../hooks/usePostFormData'

interface Categories {
  categories: Category[]
}

enum UploadError {
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  BLANK_FIELD = 'BLANK_FIELD',
  UNKNOWN = 'UNKNOWN',
}

const errorMessageMap: { [x in UploadError]: string } = {
  [UploadError.CATEGORY_NOT_FOUND]: 'Category not found',
  [UploadError.BLANK_FIELD]: 'Please choose a file',
  [UploadError.UNKNOWN]: 'An unknown error occurred',
}

export function Upload() {
  const navigate = useNavigate()

  const [categoryList, setCategoryList] = useState<
    { label: string; value: string }[]
  >([])
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] =
    useState<boolean>(false)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<UploadError | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [fileContents, setFileContents] = useState<File | null>(null)

  const descriptionRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    data: allCategories,
    renderFetch: fetchAllCategories,
    loading: allCategoriesLoading,
  } = useFetch<Categories>(`${REACT_APP_BACKEND_URL}/category`, 'GET')

  useEffect(() => {
    fetchAllCategories()
  }, [])

  useEffect(() => {
    if (allCategoriesLoading) return
    if (allCategories?.categories) {
      setCategoryList(
        allCategories?.categories?.map((category) => ({
          label: category.name,
          value: category.id,
        }))
      )
    }
  }, [allCategories, allCategoriesLoading])

  const {
    data: uploadFileResponse,
    renderFetch: uploadFile,
    error: uploadFileError,
    loading: uploadFileLoading,
  } = usePostFormData<{ file: File }>(`${REACT_APP_BACKEND_URL}/file/new`)

  useEffect(() => {
    if (uploadFileLoading) return
    if (uploadFileResponse?.file) {
      setUploadSuccess(true)
    }
    if (uploadFileError) {
      setUploadSuccess(false)
      if (descriptionRef.current && fileRef.current) {
        descriptionRef.current.value = ''
        fileRef.current.value = ''
      }
      if (uploadFileError.code === 'AHA-CATEGORY-NOT-FOUND') {
        setUploadError(UploadError.CATEGORY_NOT_FOUND)
        return
      }
      setUploadError(UploadError.UNKNOWN)
    }
  }, [uploadFileResponse, uploadFileError, uploadFileLoading])

  const handleUploadFileClick = () => {
    if (fileRef?.current) fileRef.current.click()
  }

  const handleSubmit = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      if (!fileContents) {
        setUploadError(UploadError.BLANK_FIELD)
        return
      }

      const description = descriptionRef.current?.value

      const formData = new FormData()
      if (description) formData.append('description', description)
      if (categoryId) formData.append('categoryId', categoryId)
      formData.append('audiofile', fileContents, fileContents?.name)

      setUploadError(null)
      uploadFile(formData)
    },
    [categoryId, fileContents]
  )

  const handleDashboard = useCallback(() => {
    navigate('/dashboard')
  }, [])

  const handleOpenDialog = useCallback(() => {
    setAddCategoryDialogOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setAddCategoryDialogOpen(false)
    fetchAllCategories()
  }, [])

  return (
    <>
      <input
        ref={fileRef}
        style={{ display: 'none' }}
        type="file"
        accept="audio/*"
        onChange={(event) => {
          if (event.target.files) {
            setFileContents(event.target.files[0])
          }
        }}
      />

      <Grid container justifyContent="center" my={10}>
        <Grid item container flexDirection="column" xs={6} rowGap={2}>
          <Typography variant="h4" textAlign="center">
            Upload File
          </Typography>
          {uploadSuccess && (
            <Alert severity="success">Uploaded successfully</Alert>
          )}
          {uploadError && (
            <Alert severity="error">{errorMessageMap[uploadError]}</Alert>
          )}
          <Button variant="text" onClick={handleUploadFileClick}>
            {fileContents ? <AudioFileIcon /> : <UploadIcon />}
            {fileContents ? fileContents?.name : 'Choose File'}
          </Button>
          <TextField
            inputRef={descriptionRef}
            label="Description"
            multiline
            minRows={3}
          />

          <Grid container alignItems="center">
            <Grid item xs={10}>
              <Autocomplete
                disablePortal
                options={categoryList}
                onChange={(_, option) => {
                  if (!option) return
                  setCategoryId(option.value)
                }}
                renderInput={(params) => (
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  <TextField {...params} label="Category" />
                )}
              />
            </Grid>
            <Grid item container xs={2} justifyContent="flex-end">
              <Button
                sx={{ height: '100%', minWidth: 'fit-content' }}
                variant="text"
                onClick={handleOpenDialog}
              >
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
          <Button variant="contained" onClick={handleSubmit} type="submit">
            Upload
          </Button>
          <Button variant="outlined" onClick={handleDashboard}>
            Back to Dashboard
          </Button>
        </Grid>
      </Grid>
      <AddCategoryDialog
        open={addCategoryDialogOpen}
        handleClose={handleCloseDialog}
      />
    </>
  )
}
