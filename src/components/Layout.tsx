import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Paper,
  ClickAwayListener,
  Fab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Payment,
  CalendarToday,
  TrendingUp,
  Search,
  NotificationsOutlined,
  HelpOutlineOutlined,
  Person,
  School,
  Close,
  AutoAwesome,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Mock student data - replace with actual data source in production
const mockStudents = [
  { id: 1, name: 'Aditya Sharma', grade: '10th', rollNo: 'S101' },
  { id: 2, name: 'Priya Patel', grade: '9th', rollNo: 'S102' },
  { id: 3, name: 'Rahul Kumar', grade: '11th', rollNo: 'S103' },
  { id: 4, name: 'Sneha Gupta', grade: '10th', rollNo: 'S104' },
  { id: 5, name: 'Vikram Singh', grade: '12th', rollNo: 'S105' },
  { id: 6, name: 'Meera Kapoor', grade: '9th', rollNo: 'S106' },
  { id: 7, name: 'Arjun Reddy', grade: '11th', rollNo: 'S107' },
  { id: 8, name: 'Neha Verma', grade: '10th', rollNo: 'S108' },
];

const drawerWidth = 240;
const collapsedDrawerWidth = 72;

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '50px',
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'all 0.2s ease',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  '&:focus-within': {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(124, 58, 237, 0.4)',
  },
  [theme.breakpoints.down('sm')]: {
    marginRight: theme.spacing(1),
    marginLeft: 0,
    borderRadius: '25px',
    height: '36px',
  },
  [theme.breakpoints.only('sm')]: {
    borderRadius: '35px',
    height: '40px',
  },
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(3),
    borderRadius: '50px',
    height: '44px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.3rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.5rem',
    },
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    width: '100%',
    transition: 'width 0.2s ease-in-out',
    fontSize: '0.85rem',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
      opacity: 1,
      fontSize: '0.85rem',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.8, 0.5, 0.8, 0),
      paddingLeft: `calc(1em + ${theme.spacing(2.5)})`,
      width: '100%',
      fontSize: '0.8rem',
      '&::placeholder': {
        fontSize: '0.8rem',
      },
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1.2, 1, 1.2, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      fontSize: '0.9rem',
      '&::placeholder': {
        fontSize: '0.9rem',
      },
    },
  },
}));

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Classes', icon: <School />, path: '/dashboard/classes' },
  { text: 'Students', icon: <People />, path: '/dashboard/students' },
  { text: 'Fees', icon: <Payment />, path: '/dashboard/fees' },
  { text: 'Attendance', icon: <CalendarToday />, path: '/dashboard/attendance' },
  { text: 'Performance', icon: <TrendingUp />, path: '/dashboard/performance' },
  { text: 'AI Assistant', icon: <AutoAwesome />, path: '/dashboard/ai-assistant' },
];

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& img': {
    height: 36,
    width: 'auto',
    marginRight: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      height: 28,
      marginRight: theme.spacing(1),
    },
    [theme.breakpoints.only('sm')]: {
      height: 32,
      marginRight: theme.spacing(1.25),
    },
  },
  '& .logo-text': {
    fontWeight: 700,
    fontSize: '1.65rem',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem',
    },
    [theme.breakpoints.only('sm')]: {
      fontSize: '1.4rem',
    },
  }
}));

// Create a context for the search functionality
export const SearchContext = createContext<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}>({
  searchQuery: '',
  setSearchQuery: () => {},
});

// Export a hook to use the search context
export const useSearch = () => useContext(SearchContext);

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search...');
  const [sidebarTimer, setSidebarTimer] = useState<number | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Update search placeholder based on current route
  useEffect(() => {
    // Set different placeholder text based on current route
    if (location.pathname.includes('/dashboard/attendance')) {
      setSearchPlaceholder('Search students in Attendance');
    } else if (location.pathname.includes('/dashboard/performance')) {
      setSearchPlaceholder('Search students or exams in Performance');
    } else if (location.pathname.includes('/dashboard/students')) {
      setSearchPlaceholder('Search students');
    } else if (location.pathname.includes('/dashboard/classes')) {
      setSearchPlaceholder('Search classes');
    } else if (location.pathname.includes('/dashboard/fees')) {
      setSearchPlaceholder('Search fee records');
    } else {
      setSearchPlaceholder('Search');
    }
    
    // Clear search when changing routes
    setSearchQuery('');
  }, [location.pathname]);

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (sidebarTimer) {
        clearTimeout(sidebarTimer);
      }
    };
  }, [sidebarTimer]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  // Clear search field
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Handle search submission
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowSearchResults(false);
    // Focus is handled by the page specific search
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleProfileMenuClose();
  };

  const handleSidebarMouseEnter = () => {
    if (sidebarTimer) {
      clearTimeout(sidebarTimer);
      setSidebarTimer(null);
    }
    
    requestAnimationFrame(() => {
      setSidebarExpanded(true);
    });
  };

  const handleSidebarMouseLeave = () => {
    if (sidebarTimer) {
      clearTimeout(sidebarTimer);
    }
    
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        setSidebarExpanded(false);
      });
    }, 100); // Small delay before collapsing
    
    setSidebarTimer(timer);
  };

  const drawer = (
    <Box 
      sx={{ 
        py: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onMouseEnter={handleSidebarMouseEnter}
      onMouseLeave={handleSidebarMouseLeave}
    >
      <List sx={{ width: '100%' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/dashboard' && location.pathname === '/dashboard') ||
                          (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
          
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                margin: { xs: '2px 4px', sm: '3px 6px', md: '4px 8px' },
                position: 'relative',
                minHeight: { xs: '40px', sm: '44px', md: '48px' },
                px: { xs: 1.5, sm: 2, md: 2.5 },
                justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                '&:hover': {
                  backgroundColor: 'rgba(167, 139, 250, 0.1)',
                },
                ...(isActive && {
                  backgroundColor: 'rgba(167, 139, 250, 0.1)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '-8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: { xs: '50%', sm: '55%', md: '60%' },
                    borderRadius: '0 4px 4px 0',
                    background: 'linear-gradient(to bottom, #A78BFA, #7C3AED)',
                  },
                }),
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.6)',
                  minWidth: '40px',
                  margin: 0,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
                }}
                sx={{
                  opacity: sidebarExpanded ? 1 : 0,
                  width: sidebarExpanded ? 'auto' : 0,
                  transition: 'opacity 0.15s ease-out, width 0.15s ease-out, margin 0.15s ease-out',
                  whiteSpace: 'nowrap',
                  ml: sidebarExpanded ? 2 : 0,
                  transform: 'translateZ(0)',
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
    <Box sx={{ 
      display: 'flex',
      background: 'linear-gradient(135deg, #0A0A1A 0%, #101033 100%)',
      minHeight: '100vh',
    }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: 'blur(5px)',
          background: 'rgba(255, 255, 255, 0.08)',
          borderBottom: 'none',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          width: { xs: '94%', sm: '96%', md: '97%', lg: '98%' },
          maxWidth: { xs: '100%', sm: '100%', md: '1200px' },
          margin: { xs: '10px auto', sm: '15px auto', md: '20px auto', lg: '25px auto' },
          left: 0,
          right: 0,
          borderRadius: { xs: '20px', sm: '30px', md: '50px' },
          padding: { xs: '2px', sm: '3px', md: '4px' },
          zIndex: 1100,
          transition: 'all 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: { xs: '20px', sm: '30px', md: '50px' },
            padding: '1px',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.03))',
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
            alignItems: 'center',
            height: { xs: '48px', sm: '50px', md: '54px' },
            px: { xs: 1, sm: 1.5, md: 2, lg: 3 },
            minHeight: { xs: '48px', sm: '50px', md: '54px' },
            width: '100%',
            flexWrap: { xs: 'nowrap' },
            gap: { xs: 0.5, sm: 1, md: 2 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Logo 
              onClick={() => navigate('/dashboard')} 
              sx={{ 
                cursor: 'pointer', 
                minWidth: { xs: 'auto', sm: '150px' },
                flexShrink: 0
              }}
            >
              <img src="/logo.png" alt="DiggiClass Logo" style={{ height: '30px' }} />
              <Typography
                className="logo-text"
                variant="h5"
                component="div"
                sx={{ 
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  display: { xs: 'none', sm: 'block' } 
                }}
              >
                DiggiClass
              </Typography>
            </Logo>
          </Box>
          
          <Box
            ref={searchRef}
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ 
              flexGrow: 1, 
              maxWidth: { xs: '100%', sm: '400px', md: '600px' }, 
              mx: { xs: 0, sm: 'auto' }, 
              position: 'relative',
              display: { xs: 'flex', sm: 'block' }
            }}
          >
            <SearchBar sx={{ 
              minWidth: { xs: '40px', sm: '180px' },
              width: '100%'
            }}>
              <SearchIconWrapper>
                <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                inputRef={inputRef}
                inputProps={{ 
                  'aria-label': 'search',
                  style: { 
                    paddingRight: searchQuery ? '40px' : '10px',
                  }
                }}
                endAdornment={
                  searchQuery ? (
                    <IconButton 
                      size="small" 
                      onClick={clearSearch}
                      sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  ) : null
                }
              />
            </SearchBar>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery && (
              <Paper
                elevation={0}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: { xs: 0.5, sm: 0.75, md: 1 },
                  maxHeight: { xs: '250px', sm: '275px', md: '300px' },
                  width: '100%',
                  overflow: 'auto',
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(18, 18, 40, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: { xs: '8px', sm: '10px', md: '12px' },
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                  zIndex: 9999,
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.05)',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(124, 58, 237, 0.5)',
                    borderRadius: '4px',
                  },
                }}
              >
                {/* Mock search results - replace with actual search implementation */}
                {mockStudents
                  .filter(student => 
                    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((student) => (
                    <MenuItem 
                      key={student.id}
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                        // Navigate to student details page
                        navigate(`/dashboard/students/${student.id}`);
                      }}
                      sx={{
                        padding: '10px 16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          background: 'rgba(124, 58, 237, 0.1)',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {student.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {student.grade} • Roll No: {student.rollNo}
                      </Typography>
                    </MenuItem>
                  ))}
                  
                {mockStudents.filter(student => 
                  student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                      No results found for "{searchQuery}"
                    </Typography>
                  </Box>
                )}
                  
                <Box 
                  sx={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                    p: { xs: 1.5, sm: 2 },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                    Press Enter to search
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      // Implement full search
                      navigate(`/dashboard/search?q=${searchQuery}`);
                      setShowSearchResults(false);
                    }}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      '&:hover': {
                        background: 'rgba(124, 58, 237, 0.1)',
                      },
                    }}
                  >
                    See All Results
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 0.5, sm: 1, md: 1.5 },
            flexShrink: 0
          }}>
            <IconButton 
              color="inherit"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.2s ease',
                padding: { xs: '4px', sm: '6px', md: '8px' },
                width: { xs: '28px', sm: '32px', md: '36px' },
                height: { xs: '28px', sm: '32px', md: '36px' },
                '&:hover': {
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  color: 'white',
                  transform: 'translateY(-2px)',
                },
              }}
            >
                <NotificationsOutlined sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' } }} />
            </IconButton>
            <IconButton 
              edge="end" 
              color="inherit"
              onClick={handleProfileMenuOpen}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.2s ease',
                padding: { xs: '2px', sm: '4px', md: '4px' },
                '&:hover': {
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  color: 'white',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: { xs: 28, sm: 32, md: 36 }, 
                  height: { xs: 28, sm: 32, md: 36 },
                  background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    border: '2px solid rgba(124, 58, 237, 0.5)',
                  },
                }}
              >
                  <Person sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' } }} />
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                backdropFilter: 'blur(10px)',
                background: 'rgba(18, 18, 40, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                minWidth: '220px',
                '& .MuiMenuItem-root': {
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.95rem',
                  padding: '12px 20px',
                  '&:hover': {
                    background: 'rgba(124, 58, 237, 0.1)',
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => handleMenuItemClick('/dashboard/profile')}>
              My Profile
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/dashboard/settings')}>
              Account Settings
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/dashboard/billing')}>
              Subscription / Billing
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/dashboard/notifications')}>
              Notifications
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/contact')}>
              Contact Us
            </MenuItem>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <MenuItem onClick={handleLogout} sx={{ color: '#ff6b6b' }}>
              Log Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
        
        {/* Compact mobile menu button with 3 lines and glassy design */}
        <Fab
          size="small"
          color="primary" 
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: { xs: 72 },
            left: { xs: 16 },
            display: { xs: 'flex', sm: 'none' },
            zIndex: 1055,
            backgroundColor: 'rgba(124, 58, 237, 0.4)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: 32,
            height: 32,
            minHeight: 'unset',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s ease',
            padding: 0,
            '&:hover': {
              backgroundColor: 'rgba(124, 58, 237, 0.5)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), 0 0 8px rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            },
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 14,
            height: 12,
          }}>
            {/* Three lines icon */}
            <Box sx={{
              width: '100%',
              height: 1.5,
              backgroundColor: 'white',
              borderRadius: 4,
              opacity: 0.9,
            }} />
            <Box sx={{
              width: '100%',
              height: 1.5,
              backgroundColor: 'white',
              borderRadius: 4,
              opacity: 0.9,
            }} />
            <Box sx={{
              width: '100%',
              height: 1.5,
              backgroundColor: 'white',
              borderRadius: 4,
              opacity: 0.9,
            }} />
          </Box>
        </Fab>
      
      <Box
        component="nav"
        sx={{ 
          width: { sm: sidebarExpanded ? drawerWidth : collapsedDrawerWidth }, 
          flexShrink: { sm: 0 },
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 1040,
          willChange: 'width',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarExpanded ? drawerWidth : collapsedDrawerWidth,
              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
              transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'width',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px',
              overflowX: 'hidden',
              contain: 'layout style size',
              transformStyle: 'preserve-3d',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.01)',
                pointerEvents: 'none',
                zIndex: -1
              }
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          width: { sm: `calc(100% - ${sidebarExpanded ? drawerWidth : collapsedDrawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A0A1A 0%, #101033 100%)',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'width',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          mt: { xs: '100px', sm: '95px', md: '100px' },
          ml: { xs: 0, sm: `${collapsedDrawerWidth}px` },
          position: 'relative',
          zIndex: 1030,
          pt: { xs: 5, sm: 3 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
    </SearchContext.Provider>
  );
};

export default Layout; 