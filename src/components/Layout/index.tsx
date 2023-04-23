import { useState, MouseEvent, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import AccountCircle from '@mui/icons-material/AccountCircle'
import useFetch from '../../hooks/useFetch'

export function Layout({ isLoggedIn }: { isLoggedIn: boolean }) {
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const { data: logoutResponse, renderFetch: logout } = useFetch<{}>(
    `${process.env.REACT_APP_BACKEND_URL}/user/logout`,
    'DELETE'
  )

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  const handleMyAccount = () => {
    setAnchorEl(null)
    navigate('/my-account')
  }

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
  }

  useEffect(() => {
    if (logoutResponse) {
      navigate('/')
    }
  }, [logoutResponse])

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
