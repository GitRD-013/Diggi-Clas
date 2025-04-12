import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Close,
  People,
  Lock,
  Assessment,
  Receipt,
  CalendarMonth,
  Notifications,
  FileDownload,
  CameraAlt,
  Build,
  Rocket
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

const MotionBox = styled(motion.div)({});
const MotionTypography = styled(motion(Typography))({});
const MotionButton = styled(motion(Button))({});

// Common styles for feature descriptions - using !important with higher specificity
const FeatureDescriptionStyle = {
  display: 'block', 
  color: 'rgba(255, 255, 255, 0.7)',
  mt: 0.5,
  textAlign: 'left !important',
  width: '100%',
  padding: 0,
  margin: '0.5rem 0 0 0',
  alignSelf: 'flex-start',
  justifySelf: 'flex-start',
};

const PricingCard = styled(Card)(({ theme, isPro, isYearly }: { theme?: any, isPro?: boolean, isYearly?: boolean }) => ({
  height: '100%',
  borderRadius: '24px',
  background: isPro ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isPro ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
  boxShadow: isPro ? '0 15px 50px rgba(124, 58, 237, 0.3)' : '0 15px 50px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: isPro ? '0 20px 60px rgba(124, 58, 237, 0.4)' : '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
}));

interface PricingFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  premium: boolean | string;
  icon: React.ReactNode;
}

const PricingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isYearly, setIsYearly] = useState(false);

  const handleBillingChange = () => {
    setIsYearly(!isYearly);
  };

  const pricingFeatures: PricingFeature[] = [
    { 
      name: 'Student Limit', 
      free: '25 students', 
      pro: '500 students', 
      premium: 'Unlimited students', 
      icon: <People /> 
    },
    { 
      name: 'Login Access', 
      free: '1 Admin login', 
      pro: '3 Admin logins', 
      premium: '10+ Admin logins', 
      icon: <Lock /> 
    },
    { 
      name: 'Performance Tracking', 
      free: 'Limited', 
      pro: 'Full', 
      premium: 'Full', 
      icon: <Assessment /> 
    },
    { 
      name: 'Fee Management', 
      free: 'Basic tracking', 
      pro: 'Automated & Reports', 
      premium: 'Automated, Reports + Insights', 
      icon: <Receipt /> 
    },
    { 
      name: 'Attendance Calendar', 
      free: 'Manual', 
      pro: 'Visual + Export', 
      premium: 'Visual, Export, Alerts', 
      icon: <CalendarMonth /> 
    },
    { 
      name: 'Payment Reminders', 
      free: false, 
      pro: true, 
      premium: true, 
      icon: <Notifications /> 
    },
    { 
      name: 'Export Data', 
      free: false, 
      pro: 'CSV Export', 
      premium: 'CSV + PDF Export', 
      icon: <FileDownload /> 
    },
    { 
      name: 'Student Profile Images', 
      free: false, 
      pro: true, 
      premium: true, 
      icon: <CameraAlt /> 
    },
    { 
      name: 'Support', 
      free: 'Community support only', 
      pro: 'Email support', 
      premium: 'Priority support', 
      icon: <Build /> 
    }
  ];

  // Calculate discounted yearly prices (2 months free)
  const calculateYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 10).toFixed(0);
  };

  return (
    <GradientBox>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ pt: { xs: 12, md: 14 }, pb: 8, textAlign: 'center' }}>
          <MotionTypography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Choose Your Plan
          </MotionTypography>
          
          <MotionTypography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 6,
              maxWidth: '700px',
              mx: 'auto',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Select the perfect plan for your needs. All plans include secure cloud storage and smart student management.
          </MotionTypography>
          
          <Box sx={{ mb: 6 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={isYearly}
                  onChange={handleBillingChange}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#A78BFA',
                      '&:hover': {
                        backgroundColor: 'rgba(167, 139, 250, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#7C3AED',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    sx={{ 
                      mr: 1,
                      color: !isYearly ? '#A78BFA' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: !isYearly ? 600 : 400,
                    }}
                  >
                    Monthly
                  </Typography>
                  <Typography 
                    sx={{ 
                      ml: 1,
                      color: isYearly ? '#A78BFA' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: isYearly ? 600 : 400,
                    }}
                  >
                    Yearly
                    <Chip 
                      label="Save 16%" 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        bgcolor: 'rgba(124, 58, 237, 0.2)',
                        color: '#A78BFA',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }} 
                    />
                  </Typography>
                </Box>
              }
              labelPlacement="end"
              sx={{ mx: 'auto' }}
            />
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {/* Free Plan */}
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <PricingCard isYearly={isYearly}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4, pb: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>
                        Free Plan
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          ₹0
                        </Typography>
                        <Typography variant="subtitle1" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                          /{isYearly ? 'year' : 'month'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
                        Perfect for small tutors just getting started
                      </Typography>
                      <MotionButton
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/signup')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        sx={{
                          py: 1.2,
                          borderRadius: '50px',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderWidth: 1,
                          color: 'white',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            background: 'rgba(255, 255, 255, 0.05)',
                          },
                        }}
                      >
                        Get Started Free
                      </MotionButton>
                    </Box>
                    
                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                    
                    <Box sx={{ px: 4, pb: 4 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Features include:
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {pricingFeatures.map((feature, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              mb: 2,
                              opacity: feature.free ? 1 : 0.5,
                              width: '100%',
                            }}
                          >
                            <Box sx={{ color: '#A78BFA', mr: 2, minWidth: 24, mt: 0.5 }}>
                              {feature.icon}
                            </Box>
                            <Box sx={{ width: '100%', textAlign: 'left' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'left' }}>
                                {feature.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{
                                  ...FeatureDescriptionStyle,
                                  display: 'block !important',
                                  textAlign: 'left !important',
                                }}
                              >
                                {typeof feature.free === 'string' ? feature.free : (
                                  feature.free ? '✓ Included' : '✗ Not included'
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </PricingCard>
              </MotionBox>
            </Grid>
            
            {/* Pro Plan */}
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <PricingCard isPro={true} isYearly={isYearly}>
                  {/* Most Popular Chip */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      label="Most Popular"
                      sx={{
                        bgcolor: 'rgba(124, 58, 237, 0.3)',
                        color: '#A78BFA',
                        fontWeight: 600,
                        px: 1,
                      }}
                      size="small"
                    />
                  </Box>
                  
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4, pb: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ mb: 2, color: '#A78BFA' }}>
                        Pro Plan
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          ₹{isYearly ? calculateYearlyPrice(99) : 99}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                          /{isYearly ? 'year' : 'month'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
                        Ideal for growing academies and small schools
                      </Typography>
                      <MotionButton
                        variant="contained"
                        fullWidth
                        onClick={() => navigate('/signup?plan=pro')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        sx={{
                          py: 1.2,
                          borderRadius: '50px',
                          background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
                          boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #B794F4 10%, #8B5CF6 100%)',
                          },
                        }}
                      >
                        Upgrade Now
                      </MotionButton>
                    </Box>
                    
                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <Box sx={{ px: 4, pb: 4 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                        Everything in Free, plus:
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {pricingFeatures.map((feature, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              mb: 2,
                            }}
                          >
                            <Box sx={{ color: '#A78BFA', mr: 2, minWidth: 24, mt: 0.5 }}>
                              {feature.icon}
                            </Box>
                            <Box sx={{ width: '100%', textAlign: 'left' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'left' }}>
                                {feature.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{
                                  ...FeatureDescriptionStyle,
                                  display: 'block !important',
                                  textAlign: 'left !important',
                                }}
                              >
                                {typeof feature.pro === 'string' ? feature.pro : (
                                  feature.pro ? '✓ Included' : '✗ Not included'
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </PricingCard>
              </MotionBox>
            </Grid>
            
            {/* Premium Plan */}
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <PricingCard isYearly={isYearly}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4, pb: 2 }}>
                      <Typography variant="h6" color="primary" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.9)' }}>
                        Premium Plan
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          ₹{isYearly ? calculateYearlyPrice(199) : 199}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                          /{isYearly ? 'year' : 'month'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
                        For large institutions with advanced needs
                      </Typography>
                      <MotionButton
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate('/signup?plan=premium')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        sx={{
                          py: 1.2,
                          borderRadius: '50px',
                          borderColor: '#A78BFA',
                          borderWidth: 1,
                          color: '#A78BFA',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#B794F4',
                            background: 'rgba(167, 139, 250, 0.08)',
                          },
                        }}
                      >
                        Upgrade Now
                      </MotionButton>
                    </Box>
                    
                    <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                    
                    <Box sx={{ px: 4, pb: 4 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>
                        Everything in Pro, plus:
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {pricingFeatures.map((feature, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              mb: 2,
                            }}
                          >
                            <Box sx={{ color: '#A78BFA', mr: 2, minWidth: 24, mt: 0.5 }}>
                              {feature.icon}
                            </Box>
                            <Box sx={{ width: '100%', textAlign: 'left' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'left' }}>
                                {feature.name}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                sx={{
                                  ...FeatureDescriptionStyle,
                                  display: 'block !important',
                                  textAlign: 'left !important',
                                }}
                              >
                                {typeof feature.premium === 'string' ? feature.premium : (
                                  feature.premium ? '✓ Included' : '✗ Not included'
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      
                      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(124, 58, 237, 0.08)', borderRadius: '12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rocket sx={{ color: '#A78BFA', mr: 2 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Enterprise Solutions
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                          Need a custom solution? Contact us for special pricing and features tailored to your institution.
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => navigate('/contact')}
                          sx={{
                            color: '#A78BFA',
                            mt: 1,
                            p: 0,
                            '&:hover': {
                              background: 'transparent',
                              color: '#B794F4',
                            },
                          }}
                        >
                          Contact Sales →
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </PricingCard>
              </MotionBox>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 6, p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              You can upgrade anytime. All plans include secure cloud storage and smart student management.
            </Typography>
            <Typography variant="body2" sx={{ color: '#A78BFA', mt: 1 }}>
              Need help choosing? <Button 
                variant="text" 
                size="small" 
                onClick={() => navigate('/contact')} 
                sx={{ 
                  color: '#A78BFA', 
                  textTransform: 'none',
                  fontWeight: 600,
                  position: 'relative',
                  padding: '0 4px',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: 0,
                    left: 0,
                    backgroundColor: '#A78BFA',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    background: 'transparent',
                    '&::after': {
                      width: '100%',
                    },
                  },
                }}
              >
                Talk to our team
              </Button>
            </Typography>
          </Box>
          
          {/* FAQ Section */}
          <Box sx={{ mt: 10, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
              Frequently Asked Questions
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#A78BFA' }}>
                    Can I upgrade my plan later?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Yes, you can upgrade to a higher tier plan at any time. Your new features will be available immediately, and we'll prorate your billing.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#A78BFA' }}>
                    Is there a limit to how many students I can manage?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    The Free plan supports up to 25 students, the Pro plan supports up to 500 students, and the Premium plan has no limit on the number of students you can manage.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: '#A78BFA' }}>
                    Can I cancel my subscription?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your current billing period.
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, color: '#A78BFA' }}>
                    Do you offer any discounts for educational institutions?
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Yes, we offer special discounts for educational institutions. Please contact our sales team to learn more about our educational pricing.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </GradientBox>
  );
};

export default PricingPage; 