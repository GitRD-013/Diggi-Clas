import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Link,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  LinkedIn as LinkedInIcon,
  Send as SendIcon
} from '@mui/icons-material';
import Navbar from '../components/Navbar';

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0F0F1E 0%, #121212 100%)',
  backgroundSize: '200% 200%',
  overflow: 'hidden',
  paddingBottom: theme.spacing(10),
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  padding: theme.spacing(4),
  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(10, 10, 26, 0) 70%)',
    filter: 'blur(25px)',
    opacity: 0.5,
    zIndex: 0,
  }
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  zIndex: 1,
  position: 'relative',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#A78BFA',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'rgba(255, 255, 255, 0.9)',
  }
}));

// Animations
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionBox = motion(Box);
const MotionButton = motion(Button);

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Your message has been sent. Thank you!',
      severity: 'success'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <GradientBox>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 } }}>
        <MotionTypography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Get in Touch
        </MotionTypography>
        
        <MotionTypography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            maxWidth: '700px',
            mx: 'auto',
            mb: 8,
            fontSize: { xs: '1rem', md: '1.2rem' },
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Have questions about DiggiClass? We're here to help you with anything you need.
        </MotionTypography>
        
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <MotionBox
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <ContactCard elevation={0}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    mb: 4,
                    position: 'relative',
                    zIndex: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '40px',
                      height: '3px',
                      background: 'linear-gradient(90deg, #A78BFA, #7C3AED)',
                      borderRadius: '3px',
                    }
                  }}
                >
                  Contact Information
                </Typography>
                
                <ContactItem>
                  <IconButton
                    component={Link}
                    href="mailto:itsrupamdebnath@gmail.com"
                    target="_blank"
                    rel="noopener"
                    sx={{
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      color: '#A78BFA',
                      mr: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.2)',
                      }
                    }}
                  >
                    <EmailIcon />
                  </IconButton>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                      Email
                    </Typography>
                    <Typography
                      component={Link}
                      href="mailto:itsrupamdebnath@gmail.com"
                      sx={{
                        color: 'white',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#A78BFA',
                        }
                      }}
                    >
                      itsrupamdebnath@gmail.com
                    </Typography>
                  </Box>
                </ContactItem>
                
                <ContactItem>
                  <IconButton
                    component={Link}
                    href="https://wa.me/918402802480"
                    target="_blank"
                    rel="noopener"
                    sx={{
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      color: '#A78BFA',
                      mr: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.2)',
                      }
                    }}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                      WhatsApp
                    </Typography>
                    <Typography
                      component={Link}
                      href="https://wa.me/918402802480"
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: 'white',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#A78BFA',
                        }
                      }}
                    >
                      +91 8402802480
                    </Typography>
                  </Box>
                </ContactItem>
                
                <ContactItem>
                  <IconButton
                    component={Link}
                    href="https://www.linkedin.com/in/rupam-debnath/"
                    target="_blank"
                    rel="noopener"
                    sx={{
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      color: '#A78BFA',
                      mr: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(124, 58, 237, 0.2)',
                      }
                    }}
                  >
                    <LinkedInIcon />
                  </IconButton>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 0.5 }}>
                      LinkedIn
                    </Typography>
                    <Typography
                      component={Link}
                      href="https://www.linkedin.com/in/rupam-debnath/"
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: 'white',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#A78BFA',
                        }
                      }}
                    >
                      Rupam Debnath
                    </Typography>
                  </Box>
                </ContactItem>
              </ContactCard>
            </MotionBox>
          </Grid>
          
          {/* Feedback Form */}
          <Grid item xs={12} md={7}>
            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <ContactCard elevation={0}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    mb: 4,
                    position: 'relative',
                    zIndex: 1,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: '40px',
                      height: '3px',
                      background: 'linear-gradient(90deg, #A78BFA, #7C3AED)',
                      borderRadius: '3px',
                    }
                  }}
                >
                  Send Us Feedback
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
                  <StyledTextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  
                  <StyledTextField
                    fullWidth
                    label="Email (optional)"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                  />
                  
                  <StyledTextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                  
                  <MotionButton
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    sx={{
                      mt: 2,
                      py: 1.2,
                      px: 4,
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                      boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
                      fontWeight: 600,
                      textTransform: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        boxShadow: '0 15px 25px rgba(124, 58, 237, 0.4)',
                        '&::before': {
                          opacity: 1,
                        },
                      },
                      '& .MuiButton-endIcon': {
                        position: 'relative',
                        zIndex: 1,
                      },
                      '& .MuiButton-label': {
                        position: 'relative',
                        zIndex: 1,
                      },
                    }}
                  >
                    <span style={{ position: 'relative', zIndex: 1 }}>Send Message</span>
                  </MotionButton>
                </Box>
              </ContactCard>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GradientBox>
  );
};

export default ContactPage; 