import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, School, Person, Groups, ArrowForward } from '@mui/icons-material';
import Navbar from '../components/Navbar';

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0F0F1E 0%, #121212 100%)',
  backgroundSize: '200% 200%',
  overflow: 'hidden',
  paddingBottom: theme.spacing(10),
}));

const MotionBox = styled(motion.div)({});
const MotionTypography = styled(motion(Typography))({});
const MotionButton = styled(motion(Button))({});

const UsecaseDetails = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  
  // Content based on use case type
  const useCaseData = React.useMemo(() => {
    switch(type) {
      case 'schools':
        return {
          title: 'DiggiClass for Schools',
          subtitle: 'Streamline your school management with an all-in-one digital solution',
          description: 'DiggiClass helps schools manage student data, track performance, automate fee collection, and monitor attendance with powerful analytics that give administrators and teachers the insights they need.',
          image: '/images/school-dashboard.png',
          icon: <School fontSize="large" />,
          features: [
            'Manage multiple classes and sections with ease',
            'Track academic performance across subjects and terms',
            'Generate report cards and progress reports automatically',
            'Monitor fee collection and send automated reminders',
            'Track teacher and student attendance with visual analytics',
            'Provide secure parent and teacher login access',
            'Generate insights on class performance and improvement areas'
          ],
          testimonial: {
            quote: "DiggiClass has transformed how we manage our school's administrative tasks. What used to take hours now happens automatically, letting our teachers focus on what matters most - teaching.",
            author: "Anil Sharma, Principal, Delhi Public School"
          }
        };
      case 'tutors':
        return {
          title: 'DiggiClass for Private Tutors',
          subtitle: 'Grow your tutoring business with powerful tools designed for independent educators',
          description: 'As a private tutor, you need to focus on teaching, not paperwork. DiggiClass helps you track student progress, manage scheduling, collect fees, and demonstrate value to parents, all while keeping your teaching business organized.',
          image: '/images/tutor-dashboard.png',
          icon: <Person fontSize="large" />,
          features: [
            'Maintain detailed profiles for each student with notes and progress',
            'Schedule one-on-one and group sessions with calendar integration',
            'Track attendance and reschedule sessions easily',
            'Record and visualize student progress over time',
            'Generate invoices and track payments efficiently',
            'Share progress reports with parents automatically',
            'Scale your tutoring business without administrative overhead'
          ],
          testimonial: {
            quote: "As a math tutor handling 30+ students, keeping track of payments and progress was a nightmare. DiggiClass has simplified everything and impressed parents with professional reports.",
            author: "Priya Mehta, Mathematics Tutor, Mumbai"
          }
        };
      case 'coaching':
        return {
          title: 'DiggiClass for Coaching Centers',
          subtitle: 'Scale your coaching institute with comprehensive management tools',
          description: 'Coaching centers face unique challenges with batch management, competitive exams, and performance tracking. DiggiClass provides specialized tools to help coaching institutes handle multiple batches, track student rankings, and demonstrate success rates.',
          image: '/images/coaching-dashboard.png',
          icon: <Groups fontSize="large" />,
          features: [
            'Create and manage multiple batches across different courses',
            'Track competitive exam performance with mock test analytics',
            'Compare student rankings within batches and across centers',
            'Manage faculty allocation and subject-wise performance',
            'Track fee payments with flexible installment options',
            'Generate detailed reports on success rates and improvement',
            'Visualize batch performance with advanced analytics'
          ],
          testimonial: {
            quote: "Our JEE coaching center manages over 500 students across multiple batches. DiggiClass helps us identify top performers, track progress, and show parents concrete improvement in their children's scores.",
            author: "Rajesh Kumar, Director, Excel Coaching Institute, Kota"
          }
        };
      default:
        return {
          title: 'DiggiClass Use Cases',
          subtitle: 'Discover how DiggiClass can help different educational institutions',
          description: 'DiggiClass is designed to adapt to the needs of various educational settings - from schools to private tutors to coaching centers. Explore our specialized solutions for each type of institution.',
          image: '/images/general-dashboard.png',
          icon: null,
          features: [
            'Customizable features for different educational needs',
            'Scalable solution from single tutors to large institutions',
            'Specialized tools for different teaching environments',
            'Data-driven insights for student performance',
            'Efficient administrative management for all settings',
            'Simple fee collection and financial tracking',
            'Attendance and engagement monitoring'
          ],
          testimonial: {
            quote: "DiggiClass adapts perfectly to our unique educational model. It's flexible enough for our needs while providing the structure we need for effective management.",
            author: "Educational Innovation Center, Bangalore"
          }
        };
    }
  }, [type]);

  return (
    <GradientBox>
      <Navbar />
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Grid 
          container 
          spacing={6} 
          sx={{ 
            mt: { xs: 12, md: 14 }, 
            mb: 8,
            alignItems: 'center',
          }}
        >
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    bgcolor: 'rgba(124, 58, 237, 0.15)',
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex',
                    color: '#A78BFA'
                  }}
                >
                  {useCaseData.icon}
                </Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                    background: 'linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                  }}
                >
                  {useCaseData.title}
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 500,
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {useCaseData.subtitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.7,
                }}
              >
                {useCaseData.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 6 }}>
                <MotionButton
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/pricing')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #B794F4 10%, #8B5CF6 100%)',
                    },
                  }}
                >
                  Get Started Now
                </MotionButton>
                <MotionButton
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/demo')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '50px',
                    borderColor: 'rgba(167, 139, 250, 0.5)',
                    borderWidth: 2,
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#A78BFA',
                      background: 'rgba(167, 139, 250, 0.08)',
                    },
                  }}
                >
                  Request Demo
                </MotionButton>
              </Box>
            </MotionBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box
                component="img"
                src={useCaseData.image}
                alt={`${useCaseData.title} Dashboard`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              />
              
              {/* Overlay gradient */}
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(10, 10, 26, 0) 0%, rgba(10, 10, 26, 0.8) 100%)',
                  opacity: 0.4,
                }}
              />
            </MotionBox>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          <Grid item xs={12}>
            <MotionTypography
              variant="h3"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                mb: 4,
                fontWeight: 700,
                textAlign: 'center',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Key Features for {useCaseData.title.split(' ').pop()}
            </MotionTypography>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <List sx={{ py: 0 }}>
                {useCaseData.features.map((feature, index) => (
                  <ListItem
                    key={index}
                    component={motion.li}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    sx={{ 
                      py: 2, 
                      borderBottom: index !== useCaseData.features.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Check sx={{ color: '#A78BFA' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature} 
                      primaryTypographyProps={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Testimonial Section */}
        <Grid container justifyContent="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={10} lg={8}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              sx={{
                p: 5,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.03) 100%)',
                border: '1px solid rgba(167, 139, 250, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-10%',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(10, 10, 26, 0) 70%)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  zIndex: 0,
                }}
              />

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  lineHeight: 1,
                  color: 'rgba(167, 139, 250, 0.2)',
                  mb: 3,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                "
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  fontStyle: 'italic',
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.7,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {useCaseData.testimonial.quote}
              </Typography>
              
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#A78BFA',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {useCaseData.testimonial.author}
              </Typography>
            </MotionBox>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Grid container justifyContent="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={10} lg={8}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              sx={{
                textAlign: 'center',
                p: 5,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                Ready to transform how you manage your {type === 'schools' ? 'school' : type === 'tutors' ? 'tutoring' : 'coaching center'}?
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Join thousands of educational institutions that are already using DiggiClass to simplify their management and improve student outcomes.
              </Typography>
              
              <MotionButton
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #B794F4 10%, #8B5CF6 100%)',
                  },
                }}
              >
                Get Started Free
              </MotionButton>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </GradientBox>
  );
};

export default UsecaseDetails; 