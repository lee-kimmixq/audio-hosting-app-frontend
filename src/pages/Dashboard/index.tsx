import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Card } from '../../components/Card'
import { REACT_APP_BACKEND_URL } from '../../config'
import useFetch from '../../hooks/useFetch'
import { File } from '../../types/shared'

interface Files {
  files: File[]
}

export function Dashboard() {
  const [list, setList] = useState<Files>({ files: [] })

  const {
    data,
    renderFetch: fetchAllFiles,
    loading,
  } = useFetch<Files>(`${REACT_APP_BACKEND_URL}/file`, 'GET')

  useEffect(() => {
    fetchAllFiles()
  }, [])

  useEffect(() => {
    if (loading) return
    if (data) {
      setList(data)
    }
  }, [data, loading])

  if (loading) {
    return <h1>Loading</h1>
  }

  if (!list?.files?.length) {
    return (
      <Grid container justifyContent="center" my={10}>
        <Typography variant="h6" color="GrayText">
          No files uploaded
        </Typography>
      </Grid>
    )
  }

  return (
    <Grid container justifyContent="center" my={10} rowGap={2}>
      {list?.files?.map((file) => (
        <Card key={file.id} file={file} />
      ))}
    </Grid>
  )
}
