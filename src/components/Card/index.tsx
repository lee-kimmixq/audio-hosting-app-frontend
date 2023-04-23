import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
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
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
        </Box>
      </Box>
    </MuiCard>
  )
}
