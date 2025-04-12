import { useState } from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography, Badge, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { 
  KeyboardArrowDown,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Styled components
const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& img': {
    height: 30,
    width: 'auto',
    marginRight: theme.spacing(1),
  },
  '& .logo-text': {
    fontWeight: 700,
    fontSize: '1.5rem',
    letterSpacing: '-0.5px',
    color: '#ffffff',
  }
}));

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [usecasesAnchor, setUsecasesAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Handlers for dropdown menus
  const handleOpenUsecases = (event: React.MouseEvent<HTMLElement>) => {
    setUsecasesAnchor(event.currentTarget);
  };
  
  const handleCloseUsecases = () => {
    setUsecasesAnchor(null);
  };
  
  // Handlers for mobile menu
  const handleOpenMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  
  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null);
  };

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    handleCloseMobileMenu(); // Close mobile menu if open
    
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Function to navigate to PricingPage
  const goToPricing = () => {
    handleCloseMobileMenu(); // Close mobile menu if open
    navigate('/pricing');
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.08)',
        borderBottom: 'none',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        width: '94%',
        maxWidth: '1200px',
        margin: '25px auto',
        left: 0,
        right: 0,
        borderRadius: '50px',
        padding: '6px',
        zIndex: 1100,
        transition: 'all 0.3s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: '50px',
          padding: '1px',
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '60px',
          px: { xs: 2, md: 3 },
          minHeight: '60px',
          width: '100%',
        }}
      >
        {/* Logo */}
        <Logo onClick={() => navigate('/')} sx={{ cursor: 'pointer', minWidth: { xs: '130px', md: '150px' } }}>
          <img src="/logo.png" alt="DiggiClass Logo" style={{ height: '30px' }} />
          <Typography
            className="logo-text"
            variant="h5"
            component="div"
            sx={{ fontSize: '1.5rem' }}
          >
            DiggiClass
          </Typography>
        </Logo>
        
        {/* Center Navigation Links - Desktop Only */}
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2, md: 3 },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {/* Navigation links */}
            <Box>
              <Button
                color="inherit"
                onClick={() => scrollToSection('about-section')}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  py: 1,
                  px: 1,
                  color: 'rgba(255, 255, 255, 0.85)',
                  position: 'relative',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#fff',
                    background: 'transparent',
                    boxShadow: 'none',
                  },
                }}
              >
                About
              </Button>
            </Box>
            
            <Box>
              <Button
                color="inherit"
                onClick={() => scrollToSection('features-section')}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  py: 1,
                  px: 1,
                  color: 'rgba(255, 255, 255, 0.85)',
                  position: 'relative',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#fff',
                    background: 'transparent',
                    boxShadow: 'none',
                  },
                }}
              >
                Features
              </Button>
            </Box>
            
            <Box>
              <Button
                color="inherit"
                onClick={handleOpenUsecases}
                endIcon={<KeyboardArrowDown fontSize="small" />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  py: 1,
                  px: 1,
                  color: 'rgba(255, 255, 255, 0.85)',
                  position: 'relative',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#fff',
                    background: 'transparent',
                    boxShadow: 'none',
                  },
                }}
              >
                Usecases
              </Button>
            </Box>
            
            <Box>
              <Button
                color="inherit"
                onClick={goToPricing}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  py: 1,
                  px: 1,
                  color: 'rgba(255, 255, 255, 0.85)',
                  position: 'relative',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: '#fff',
                    background: 'transparent',
                    boxShadow: 'none',
                  },
                }}
              >
                Pricing
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Right Side Action Items */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1
        }}>
          {/* Mobile Menu Icon - Visible only on mobile */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleOpenMobileMenu}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/contact')}
              sx={{
                bgcolor: 'white',
                color: '#121212',
                textTransform: 'none',
                borderRadius: '50px',
                px: { xs: 2, md: 3.5 },
                py: 1,
                fontWeight: 500,
                fontSize: { xs: '0.9rem', md: '1.05rem' },
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Contact us
            </Button>
          </motion.div>
        </Box>

        {/* Mobile Menu Dropdown */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleCloseMobileMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1.5,
              backdropFilter: 'blur(20px)',
              background: 'rgba(18, 18, 40, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              '& .MuiMenuItem-root': {
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '1rem',
                padding: '12px 24px',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.1)',
                },
              },
              minWidth: '200px',
            },
          }}
        >
          <MenuItem onClick={() => scrollToSection('about-section')}>
            About
          </MenuItem>
          <MenuItem onClick={() => scrollToSection('features-section')}>
            Features
          </MenuItem>
          <MenuItem onClick={() => {
            handleCloseMobileMenu();
            handleOpenUsecases(window.event as unknown as React.MouseEvent<HTMLElement>);
          }}>
            Usecases
          </MenuItem>
          <MenuItem onClick={goToPricing}>
            Pricing
          </MenuItem>
        </Menu>
        
        {/* Usecases Dropdown - Shown for both Mobile and Desktop */}
        <Menu
          anchorEl={usecasesAnchor}
          open={Boolean(usecasesAnchor)}
          onClose={handleCloseUsecases}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              mt: 2,
              backdropFilter: 'blur(10px)',
              background: 'rgba(18, 18, 40, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              '& .MuiMenuItem-root': {
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.95rem',
                padding: '10px 20px',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.1)',
                },
              },
              minWidth: '200px',
            },
          }}
        >
          <MenuItem onClick={() => { navigate('/usecases/schools'); handleCloseUsecases(); }}>
            For Schools
          </MenuItem>
          <MenuItem onClick={() => { navigate('/usecases/tutors'); handleCloseUsecases(); }}>
            For Private Tutors
          </MenuItem>
          <MenuItem onClick={() => { navigate('/usecases/coaching'); handleCloseUsecases(); }}>
            For Coaching Centers
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 