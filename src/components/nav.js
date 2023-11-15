import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useAuth0 } from "@auth0/auth0-react";

function Nav() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const {
    isLoading,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
  logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
  });

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" className='nav-body'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img src='/logo.png' className='logo-img'/>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <a href='/now-playing-movies' className='mobile-nav-links'>
                <MenuItem>
                  <Typography textAlign="center">Now Playing</Typography>
                </MenuItem>
                </a>
                <a href='/popular-movies' className='mobile-nav-links'>
                <MenuItem>
                  <Typography textAlign="center">Popular</Typography>
                </MenuItem>
                </a>
                <a href='/top-rated-movies' className='mobile-nav-links'>
                <MenuItem>
                  <Typography textAlign="center">Top Rated</Typography>
                </MenuItem>
                </a>
                <a href='/upcoming-movies' className='mobile-nav-links'>
                <MenuItem>
                  <Typography textAlign="center">upcoming</Typography>
                </MenuItem>
                </a>
            </Menu>
          </Box>
          <Box
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img src='/logo.png' className='logo-img'/>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} className='nav-links'>
              <a href='/now-playing-movies'>
            <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Now Playing
              </Button>
              </a>
              <a href='/popular-movies'>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Popular
              </Button>
              </a>
              <a href='/top-rated-movies'>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Top Rated
              </Button>
              </a>
              <a href='/upcoming-movies'>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Upcoming
              </Button>
              </a>
          </Box>
          {!isLoading && !isAuthenticated ? <Box sx={{ flexGrow: 0 }}>
            <Button
                onClick={() => loginWithRedirect()}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Login / Signup
              </Button>
          </Box> :
          <Box sx={{ flexGrow: 0 }} className="profile-picture">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.name} src={user?.picture}/>
              </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                  <Typography textAlign="center" onClick={() => logoutWithRedirect()}>Logout</Typography>
                </MenuItem>
            </Menu>
          </Box>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Nav;