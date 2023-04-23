import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import { File } from '../../types/shared'

interface CardProps {
  file: File
}

export function Card({ file }: CardProps) {
  return (
    <MuiCard
      sx={{ display: 'flex', width: '80%', justifyContent: 'space-between' }}
    >
      <Box sx={{ display: 'flex', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {file?.path?.substring(file.path.lastIndexOf('/') + 1)}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            {`${file?.description?.substring(0, 40)}...`}
          </Typography>
          <Stack direction="row" spacing={1}>
            {file?.categories?.map((category) => (
              <Chip
                key={category?.id}
                label={category?.name}
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
        </CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            pr: 3,
          }}
        >
          <audio controls>
            <track kind="captions" />
            <source src={file?.path} type="audio/mpeg" />
            <p>
              Your browser does not support HTML audio, but you can still
              <a href="audiofile.mp3">download the music</a>.
            </p>
          </audio>
        </Box>
      </Box>
    </MuiCard>
  )
}
