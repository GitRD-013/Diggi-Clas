import React from 'react';
import { Box, Grid, Typography, Card, CardContent, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { AutoGraph, School, Payment, CalendarMonth, Insights, SmartToy, Notifications } from '@mui/icons-material';

const MotionCard = motion(Card);

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <MotionCard
      whileHover={{ 
        y: -8,
        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
        borderColor: 'rgba(167, 139, 250, 0.3)'
      }}
      transition={{ duration: 0.3 }}
      sx={{ 
        height: '100%', 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        position: 'relative',
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
        },
        '&:hover::after': {
          opacity: 0.6,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Box sx={{ 
            mb: 2, 
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'rgba(124, 58, 237, 0.1)',
            marginBottom: 2
          }}>
            {icon}
          </Box>
        </motion.div>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </MotionCard>
  );
};

const AppFeatures = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <School sx={{ fontSize: 30 }} />,
      title: 'Student Management',
      description: 'Manage student profiles, track academic progress, and store important documents and information.',
    },
    {
      icon: <Payment sx={{ fontSize: 30 }} />,
      title: 'Fee Management',
      description: 'Track fee payments, generate invoices, and send reminders for overdue payments automatically.',
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 30 }} />,
      title: 'Attendance Tracking',
      description: 'Record and analyze student attendance patterns with easy-to-use interfaces and reporting.',
    },
    {
      icon: <Insights sx={{ fontSize: 30 }} />,
      title: 'Performance Tracking',
      description: 'Monitor academic performance with customizable metrics and generate detailed performance reports.',
    },
    {
      icon: <SmartToy sx={{ fontSize: 30 }} />,
      title: 'AI Support',
      description: 'Leverage AI to provide personalized learning recommendations and identify at-risk students.',
    },
    {
      icon: <Notifications sx={{ fontSize: 30 }} />,
      title: 'Payment Reminders',
      description: 'Automatically send reminders for upcoming and overdue fee payments to students and parents.',
    },
  ];

  return (
    <Box 
      sx={{ 
        py: { xs: 8, md: 12 },
        background: theme.palette.background.default
      }}
      id="features-section"
    >
      <Box 
        sx={{ 
          maxWidth: 'lg', 
          mx: 'auto', 
          px: { xs: 2, sm: 4, md: 6 } 
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            component="h2" 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: 'linear-gradient(90deg, #cc73f8 0%, #9940D3 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            Features That Make A Difference
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '750px', 
              mx: 'auto',
              fontWeight: 400
            }}
          >
            DiggiClass empowers educational institutions with comprehensive tools designed to simplify administration and enhance student learning outcomes.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Feature
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default AppFeatures; 