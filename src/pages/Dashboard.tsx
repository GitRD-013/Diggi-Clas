import { Box, Card, CardContent, Grid, Typography, Button, useTheme } from '@mui/material';
import {
  People,
  Payment,
  CalendarToday,
  TrendingUp,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const stats = [
  {
    title: 'Total Students',
    value: '250',
    icon: <People />,
    color: '#cc73f8',
    path: '/dashboard/students'
  },
  {
    title: 'Pending Fees',
    value: '₹45,000',
    icon: <Payment />,
    color: '#ff6b6b',
    path: '/dashboard/fees'
  },
  {
    title: 'Today\'s Attendance',
    value: '85%',
    icon: <CalendarToday />,
    color: '#4ecdc4',
    path: '/dashboard/attendance'
  },
  {
    title: 'Average Performance',
    value: '78%',
    icon: <TrendingUp />,
    color: '#ffd93d',
    path: '/dashboard/performance'
  },
];

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // In a real implementation, this would be retrieved from a user context or API
  const institutionName = "ABC Academy";

  // Handle add new student button click
  const handleAddStudent = () => {
    navigate('/dashboard/students', { state: { openAddForm: true } });
  };

  return (
    <Box>
      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          mb: 6,
          p: 6,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}40 0%, #0f0f1a 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              color: 'white',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Welcome back, {institutionName}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              mb: 3,
              lineHeight: 1.5,
            }}
          >
            Here's what's happening today:
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <Box
                  onClick={() => navigate(stat.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 30px ${stat.color}40`,
                      borderColor: `${stat.color}60`,
                      background: `rgba(255, 255, 255, 0.08)`,
                      '& .stat-icon': {
                        transform: 'scale(1.1)',
                        boxShadow: `0 0 15px ${stat.color}`,
                      }
                    },
                  }}
                >
                  <Box
                    className="stat-icon"
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      background: `${stat.color}20`,
                      color: stat.color,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box>
            <Button
              variant="contained"
              size="medium"
              onClick={handleAddStudent}
              sx={{
                py: 1,
                px: 3,
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #cc73f8 0%, #9940D3 100%)',
                fontSize: '0.9rem',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #d382f9 10%, #a44dd8 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(204, 115, 248, 0.3)',
                },
              }}
            >
              Add New Student
            </Button>
          </Box>
        </Box>
      </MotionBox>

      {/* Stats Cards Section - Removed as stats are now in hero section */}
      
      {/* Rest of dashboard content can go here */}
    </Box>
  );
};

export default Dashboard; 