import { useState, MouseEvent, useEffect, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AddIcon from '@mui/icons-material/Add'

import Fab from '@mui/material/Fab'
import { REACT_APP_BACKEND_URL } from '../../config'
import { useAuth } from '../../contexts/AuthContext'
import useFetch from '../../hooks/useFetch'

export function Layout({ isLoggedIn }: { isLoggedIn: boolean | null }) {
  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { data: logoutResponse, renderFetch: logout } = useFetch<{}>(
    `${REACT_APP_BACKEND_URL}/user/logout`,
    'DELETE'
  )

  useEffect(() => {
    if (logoutResponse) {
      setAuth(false)
      navigate('/')
    }
  }, [logoutResponse])

  const handleMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleDashboard = useCallback(() => {
    navigate('/dashboard')
  }, [])

  const handleMyAccount = useCallback(() => {
    setAnchorEl(null)
    navigate('/my-account')
  }, [])

  const handleLogout = useCallback(() => {
    setAnchorEl(null)
    logout()
  }, [])

  const handleUpload = useCallback(() => {
    setAnchorEl(null)
    navigate('/upload')
  }, [])

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, pointerEvents: 'auto', cursor: 'pointer' }}
              onClick={handleDashboard}
            >
              Audio Hosting App
            </Typography>
            {isLoggedIn && (
              <div>
                <Fab
                  size="medium"
                  variant="extended"
                  color="info"
                  onClick={handleUpload}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  Upload
                </Fab>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMyAccount}
                >
                  <MenuItem onClick={handleMyAccount}>My Account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  )
}
