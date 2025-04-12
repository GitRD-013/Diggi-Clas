import { Box, Button, Container, Typography, Grid, useMediaQuery, useTheme, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowForward, LockOutlined, ExpandMore, CheckCircle, Speed, TrendingUp, Devices } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #101033 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.12) 0%, rgba(10, 10, 26, 0) 60%)',
    zIndex: 0,
  }
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& img': {
    height: 38,
    width: 'auto',
    marginRight: theme.spacing(1.5),
  },
  '& .logo-text': {
    fontWeight: 700,
    fontSize: '1.75rem',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }
}));

const IllustrationCard = styled(MotionBox)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-20px',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, rgba(10, 10, 26, 0) 70%)',
    borderRadius: '50%',
    zIndex: 0,
  },
  '& .card': {
    width: '100%',
    maxWidth: 500,
    aspectRatio: '3/2',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 20px 80px rgba(124, 58, 237, 0.2)',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  '& .glow': {
    position: 'absolute',
    width: '150px',
    height: '150px',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(10, 10, 26, 0) 70%)',
    borderRadius: '50%',
    filter: 'blur(20px)',
    zIndex: 0,
  },
  '& .glow-1': {
    top: '20%',
    right: '10%',
  },
  '& .glow-2': {
    bottom: '10%',
    left: '20%',
  },
  '& svg': {
    width: '80%',
    height: 'auto',
    maxHeight: '200px',
    position: 'relative',
    zIndex: 1,
  }
}));

const FeatureCard = styled(MotionCard)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: theme.spacing(3),
  height: '100%',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
    border: '1px solid rgba(167, 139, 250, 0.3)',
    '& .emoji': {
      transform: 'scale(1.2)',
      filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.6))',
    },
    '&::after': {
      opacity: 0.6,
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(10, 10, 26, 0) 70%)',
    filter: 'blur(15px)',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 0,
  }
}));

const EmojiContainer = styled(Box)(({ theme }) => ({
  fontSize: '2.5rem',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  display: 'inline-block',
}));

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Feature data
  const features = [
    {
      emoji: '🎓',
      title: 'Smart Student Profiles',
      description: 'Store photos, info, fees, and attendance.',
    },
    {
      emoji: '📊',
      title: 'Performance Tracking',
      description: 'Analyze academic growth easily.',
    },
    {
      emoji: '💰',
      title: 'Fee Management',
      description: 'Automate and track all fee records.',
    },
    {
      emoji: '📅',
      title: 'Attendance Calendar',
      description: 'Mark and view attendance visually.',
    },
    {
      emoji: '🤖',
      title: 'AI Support',
      description: 'Get smart answers about student data and performance.',
      featured: true,
    },
    {
      emoji: '🔔',
      title: 'Payment Reminders',
      description: 'Automatic alerts for upcoming and overdue payments.',
      featured: true,
    },
  ];

  // Define aboutFeatures array for the About section
  const aboutFeatures = [
    {
      icon: <CheckCircle />,
      title: "Easy Management",
      description: "Simplify student records, attendance, and fee management in one place."
    },
    {
      icon: <Speed />,
      title: "Save Time",
      description: "Automate routine tasks and focus more on teaching and less on administration."
    },
    {
      icon: <TrendingUp />,
      title: "Track Progress",
      description: "Monitor student performance with detailed analytics and reports."
    },
    {
      icon: <Devices />,
      title: "Access Anywhere",
      description: "Use on any device with our responsive web and mobile applications."
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <GradientBox sx={{ minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <Box sx={{ mt: { xs: 8, md: 10 }, mb: 10 }} id="features-section">
          <MotionTypography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 5,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose DiggiClass?
          </MotionTypography>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {features.slice(0, 4).map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FeatureCard
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <EmojiContainer className="emoji">
                        {feature.emoji}
                      </EmojiContainer>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Grid>
              ))}
              
              {/* Featured Cards Row */}
              <Grid container item spacing={3} sx={{ mt: 1 }}>
                {features.filter(f => f.featured).map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index + 4}>
                    <FeatureCard
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      sx={{
                        background: 'rgba(124, 58, 237, 0.08)',
                        border: '1px solid rgba(167, 139, 250, 0.2)',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '16px',
                          padding: '1.5px',
                          background: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
                          WebkitMask: 
                            'linear-gradient(#fff 0 0) content-box, ' +
                            'linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                          pointerEvents: 'none',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <EmojiContainer className="emoji" sx={{
                          fontSize: '3rem',
                          filter: 'drop-shadow(0 0 10px rgba(124, 58, 237, 0.5))',
                        }}>
                          {feature.emoji}
                        </EmojiContainer>
                        <Typography
                          variant="h6"
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #ffffff, #A78BFA)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: '1.3rem',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            position: 'relative',
                            zIndex: 1,
                            fontSize: '0.95rem',
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </FeatureCard>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </motion.div>
        </Box>

        {/* About Section */}
        <MotionBox 
          id="about-section"
          sx={{
            mt: { xs: 2, md: 4 }, 
            mb: 10, 
            py: 6,
            px: { xs: 2, md: 6 },
            borderRadius: '24px',
            background: 'rgba(124, 58, 237, 0.05)',
            border: '1px solid rgba(167, 139, 250, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s ease-in-out',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              '& .about-glow': {
                opacity: 0.8,
                transform: 'scale(1.1)',
              }
            },
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <Box
            className="about-glow"
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
              transition: 'all 0.5s ease-in-out',
              opacity: 0.5,
            }}
          />
          
          {/* Logo above heading */}
          <MotionBox
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mb: 4,
              position: 'relative',
              zIndex: 1,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box 
              component={motion.div}
              animate={{ 
                boxShadow: ['0 0 15px rgba(124, 58, 237, 0.2)', '0 0 25px rgba(124, 58, 237, 0.6)', '0 0 15px rgba(124, 58, 237, 0.2)'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              sx={{ 
                width: { xs: '70px', md: '90px' },
                height: { xs: '70px', md: '90px' },
                borderRadius: '50%',
                background: 'rgba(124, 58, 237, 0.1)',
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                overflow: 'hidden',
              }}
            >
              <img
                src="/logo.png"
                alt="DiggiClass Logo"
                style={{
                  width: '75%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </MotionBox>
          
          <MotionTypography
            variant="h2"
            sx={{ 
              textAlign: 'center',
              mb: 4,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              position: 'relative',
              zIndex: 1,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What is DiggiClass?
          </MotionTypography>
          
          <MotionTypography
            variant="body1"
            sx={{
              textAlign: 'justify',
              maxWidth: '800px',
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.9)',
              position: 'relative',
              zIndex: 1,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            DiggiClass is a modern web platform designed specifically for schools, institutions, and independent 
            teachers to efficiently manage their students. It provides a secure, intuitive interface that works 
            seamlessly across all devices — from desktops to tablets and smartphones. Built with teachers, 
            administrators, and tutors in mind, DiggiClass simplifies daily educational management tasks 
            while providing powerful insights into student performance.
          </MotionTypography>
        </MotionBox>

        {/* FAQ Section */}
        <Box sx={{ mt: { xs: 2, md: 4 }, mb: 10 }} id="faq-section">
          <MotionTypography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 5,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </MotionTypography>
          
          <Box
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              position: 'relative',
            }}
          >
            {/* Glowing effect */}
            <Box
              sx={{
                position: 'absolute',
                top: '-100px',
                left: '-100px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(10, 10, 26, 0) 70%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                zIndex: 0,
              }}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {[
                {
                  question: "Who can use DiggiClass?",
                  answer: "DiggiClass is designed for educators of all types. This includes teachers in schools, college professors, tutors, coaching institutes, and independent educators. If you manage students and need to track their performance, attendance, or fees, DiggiClass is for you."
                },
                {
                  question: "Is DiggiClass free to use?",
                  answer: "DiggiClass offers a free tier with limited features for individual teachers. For schools and educational institutions, we offer premium plans with advanced features, increased storage, and priority support. Contact us for custom pricing based on your institution's size and needs."
                },
                {
                  question: "Can I manage multiple classes and students?",
                  answer: "Absolutely! DiggiClass is built specifically to handle multiple classes, batches, and large numbers of students. You can organize students by class, subject, or any custom grouping that works for your teaching structure."
                },
                {
                  question: "Is my student data safe?",
                  answer: "Yes, security is our top priority. DiggiClass employs industry-standard encryption for all data, both in transit and at rest. We follow strict data protection regulations, and your student information is never shared with third parties. Regular backups ensure that your data is never lost."
                }
              ].map((faq, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 2,
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px !important',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: 'none',
                    '&:before': {
                      display: 'none',
                    },
                    '&.Mui-expanded': {
                      border: '1px solid rgba(167, 139, 250, 0.3)',
                      background: 'rgba(124, 58, 237, 0.08)',
                      boxShadow: '0 8px 25px rgba(124, 58, 237, 0.15)',
                      mb: 3,
                    },
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                  }}
                  TransitionProps={{ unmountOnExit: true }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: '#A78BFA' }} />}
                    sx={{
                      px: 3,
                      '& .MuiAccordionSummary-content': {
                        my: 2,
                      },
                      '&:hover': {
                        background: 'rgba(124, 58, 237, 0.05)',
                      },
                    }}
                  >
                    <MotionTypography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                      }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {faq.question}
                    </MotionTypography>
                  </AccordionSummary>
                  
                  <AccordionDetails
                    sx={{
                      px: 3,
                      pb: 3,
                      pt: 0,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        right: '-50px',
                        bottom: '-50px',
                        width: '150px',
                        height: '150px',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(10, 10, 26, 0) 70%)',
                        borderRadius: '50%',
                        filter: 'blur(30px)',
                        opacity: 0.5,
                        zIndex: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        position: 'relative',
                        zIndex: 1,
                        lineHeight: 1.7,
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </motion.div>
          </Box>
        </Box>

        {/* CTA Banner */}
        <MotionBox
          id="pricing-section"
          sx={{
            mt: { xs: 2, md: 4 },
            mb: 8,
            py: { xs: 6, md: 8 },
            px: { xs: 3, md: 6 },
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(139, 92, 246, 0.2) 100%)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            boxShadow: '0 15px 50px rgba(124, 58, 237, 0.2)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, rgba(10, 10, 26, 0) 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-30%',
              left: '-10%',
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(10, 10, 26, 0) 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              zIndex: 0,
            }}
          />
          
          {/* Star symbol */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3rem' },
              mb: 2,
              display: 'inline-block',
            }}
          >
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'inline-block' }}
            >
              ✨
            </motion.span>
          </Typography>
          
          {/* Main heading */}
          <MotionTypography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              maxWidth: '800px',
              mx: 'auto',
              position: 'relative',
              zIndex: 1,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ready to take control of your classroom?
          </MotionTypography>
          
          {/* Subtext */}
          <MotionTypography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              position: 'relative',
              zIndex: 1,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create your free account and start managing like a pro.
          </MotionTypography>
          
          {/* Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3,
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
              maxWidth: { xs: '100%', sm: '500px' },
              mx: 'auto',
            }}
          >
            <MotionButton
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                py: 1.5,
                px: 4,
                width: { xs: '100%', sm: 'auto' },
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #B794F4 10%, #8B5CF6 100%)',
                  boxShadow: '0 10px 25px rgba(124, 58, 237, 0.6)',
                },
              }}
            >
              Login Now
            </MotionButton>
            <MotionButton
              variant="outlined"
              size="large"
              onClick={() => {
                // Scroll to features section
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                py: 1.5,
                px: 4,
                width: { xs: '100%', sm: 'auto' },
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
              Explore Features
            </MotionButton>
          </Box>
        </MotionBox>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
            mt: { xs: 4, md: 0 },
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            © {new Date().getFullYear()} DiggiClass. All rights reserved.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              mt: 1,
            }}
          >
            <Typography
              component={motion.a}
              whileHover={{ color: '#A78BFA', y: -2 }}
              transition={{ duration: 0.2 }}
              variant="caption"
              color="text.secondary"
              sx={{ 
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
              onClick={() => navigate('/privacy')}
            >
              Privacy Policy
            </Typography>
            
            <Typography
              component={motion.a}
              whileHover={{ color: '#A78BFA', y: -2 }}
              transition={{ duration: 0.2 }}
              variant="caption"
              color="text.secondary"
              sx={{ 
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
              onClick={() => navigate('/terms')}
            >
              Terms of Use
            </Typography>
          </Box>
        </Box>
      </Container>
    </GradientBox>
  );
};

export default LandingPage; 