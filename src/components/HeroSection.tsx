import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import gsap from 'gsap';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-creative';

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>();

  useEffect(() => {
    // ---- GSAP Animation for the Black Container ----
    tl.current = gsap.timeline({ repeat: -1 });
    
    if (containerRef.current) {
      const createElements = () => {
        const container = containerRef.current;
        if (!container) return;
        const existingElements = container.querySelectorAll('.gsap-element');
        existingElements.forEach(el => el.remove());

        // Create shapes
        const shapes = ['circle', 'rectangle', 'diamond'];
        const colors = ['rgba(167, 139, 250, 0.2)', 'rgba(124, 58, 237, 0.2)', 'rgba(139, 92, 246, 0.2)'];
        
        for (let i = 0; i < 6; i++) {
          const shape = document.createElement('div');
          shape.className = `gsap-element shape-${i}`;
          shape.style.position = 'absolute';
          
          const shapeType = shapes[i % shapes.length];
          const color = colors[i % colors.length];
          
          const size = 20 + Math.random() * 30;
          shape.style.width = `${size}px`;
          shape.style.height = `${size}px`;
          
          if (shapeType === 'circle') {
            shape.style.borderRadius = '50%';
          } else if (shapeType === 'rectangle') {
            shape.style.borderRadius = '5px';
          } else if (shapeType === 'diamond') {
            shape.style.transform = 'rotate(45deg)';
            shape.style.borderRadius = '4px';
          }
          
          shape.style.backgroundColor = color;
          shape.style.left = `${50 + Math.random() * (container.offsetWidth - 100)}px`;
          shape.style.top = `${50 + Math.random() * (container.offsetHeight - 100)}px`;
          shape.style.opacity = '0';
          
          container.appendChild(shape);
        }
        
        // Create a header bar
        const header = document.createElement('div');
        header.className = 'gsap-element header';
        header.style.position = 'absolute';
        header.style.left = '20px';
        header.style.right = '20px';
        header.style.height = '40px';
        header.style.top = '20px';
        header.style.borderRadius = '8px';
        header.style.backgroundColor = 'rgba(124, 58, 237, 0.2)';
        header.style.transform = 'scaleX(0)';
        header.style.transformOrigin = 'left';
        
        // Create chart containers
        const leftChart = document.createElement('div');
        leftChart.className = 'gsap-element left-chart';
        leftChart.style.position = 'absolute';
        leftChart.style.left = '20px';
        leftChart.style.width = 'calc(50% - 30px)';
        leftChart.style.height = '160px';
        leftChart.style.top = '80px';
        leftChart.style.borderRadius = '8px';
        leftChart.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
        leftChart.style.opacity = '0';
        
        const rightChart = document.createElement('div');
        rightChart.className = 'gsap-element right-chart';
        rightChart.style.position = 'absolute';
        rightChart.style.right = '20px';
        rightChart.style.width = 'calc(50% - 30px)';
        rightChart.style.height = '160px';
        rightChart.style.top = '80px';
        rightChart.style.borderRadius = '8px';
        rightChart.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
        rightChart.style.opacity = '0';
        
        // Create bottom bar
        const bottomBar = document.createElement('div');
        bottomBar.className = 'gsap-element bottom-bar';
        bottomBar.style.position = 'absolute';
        bottomBar.style.left = '20px';
        bottomBar.style.right = '20px';
        bottomBar.style.height = '40px';
        bottomBar.style.bottom = '20px';
        bottomBar.style.borderRadius = '8px';
        bottomBar.style.backgroundColor = 'rgba(124, 58, 237, 0.1)';
        bottomBar.style.transform = 'scaleX(0)';
        bottomBar.style.transformOrigin = 'right';
        
        container.appendChild(header);
        container.appendChild(leftChart);
        container.appendChild(rightChart);
        container.appendChild(bottomBar);
      };
      
      createElements();
      
      if (tl.current) {
        tl.current.clear();
        tl.current.to('.gsap-element.header', { scaleX: 1, duration: 1, ease: 'power2.out' })
          .to(['.gsap-element.left-chart', '.gsap-element.right-chart'], { opacity: 1, y: 10, duration: 0.8, stagger: 0.2, ease: 'power1.out' }, '-=0.5')
          .to('.gsap-element.shape-0, .gsap-element.shape-1, .gsap-element.shape-2, .gsap-element.shape-3, .gsap-element.shape-4, .gsap-element.shape-5', { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.3')
          .to('.gsap-element.bottom-bar', { scaleX: 1, duration: 0.8, ease: 'power2.out' }, '-=0.2');

        // Continuous animations
        tl.current.to('.gsap-element.shape-0, .gsap-element.shape-2, .gsap-element.shape-4', { y: '-=20', duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true }, '-=0.5')
          .to('.gsap-element.shape-1, .gsap-element.shape-3, .gsap-element.shape-5', { y: '+=20', duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true }, '-=3');

        const headerHighlight = document.createElement('div');
        headerHighlight.className = 'gsap-element header-highlight';
        headerHighlight.style.position = 'absolute';
        headerHighlight.style.top = '20px';
        headerHighlight.style.height = '40px';
        headerHighlight.style.width = '100px';
        headerHighlight.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)';
        headerHighlight.style.left = '-100px';
        headerHighlight.style.borderRadius = '8px';
        containerRef.current?.appendChild(headerHighlight);
        
        tl.current.to('.gsap-element.header-highlight', { left: '100%', duration: 3, ease: 'none', repeat: -1, delay: 2 }, '-=3');
      }
    }
    
    // Cleanup function
    return () => {
      if (tl.current) {
        tl.current.kill();
      }
    };
  }, [containerRef]);

  const screenshotImages = [
    '/first.png', '/second.png', '/third.png', '/fourth.png', '/fifth.png',
    '/sixth.png', '/seventh.png', '/eighth.png'
  ];

  return (
    <Box 
      sx={{ 
        background: 'transparent',
        pt: { xs: 18, md: 25 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Full-width edge-to-edge spotlight gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          marginLeft: '-10vw',
          width: '60%',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(
              circle at -10% 50%, 
              rgba(139, 92, 246, 0.4) 0%,
              transparent 70%
            )
          `,
          filter: 'blur(40px)',
        }}
      />
      
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '2.5rem', md: '3.7rem' },
                  lineHeight: 1.2,
                  mb: 2,
                  color: '#fff',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Transforming
                <br />
                Education
                <br />
                Management
              </Typography>

              <Typography 
                variant="h2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontWeight: 400, 
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.5,
                  mb: 4,
                  maxWidth: '90%',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Take control of your classroom with our
                <br />
                comprehensive student management system.
                <br />
                Track attendance, manage fees, and monitor
                <br />
                performance – all in one place.
              </Typography>

              <Box 
                sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  mt: 5,
                  position: 'relative',
                  zIndex: 2,
                  width: 'auto',
                  justifyContent: 'flex-start'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{ 
                    display: 'inline-block',
                    width: 'auto' 
                  }}
                >
                  <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      textTransform: 'none',
                      fontSize: { xs: '15px', sm: '16px' },
                      py: 1.5,
                      px: { xs: 2.5, sm: 4 },
                      borderRadius: '50px',
                      fontWeight: 600,
                      background: 'linear-gradient(90deg, #A78BFA 0%, #7C3AED 100%)',
                      boxShadow: '0 8px 20px rgba(153, 64, 211, 0.25)',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(153, 64, 211, 0.4)',
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{ 
                    display: 'inline-block',
                    width: 'auto'
                  }}
                >
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/login"
                    size="large"
                    startIcon={<LockOutlinedIcon />}
                    sx={{
                      textTransform: 'none',
                      fontSize: { xs: '15px', sm: '16px' },
                      py: 1.5,
                      px: { xs: 2.5, sm: 4 },
                      borderRadius: '50px',
                      fontWeight: 600,
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderWidth: 1.5,
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        borderColor: '#A78BFA',
                        background: 'rgba(167, 139, 250, 0.08)',
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.3s ease',
                      },
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                minHeight: '400px'
              }}
            >
              <Box
                ref={containerRef} 
                sx={{ 
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  zIndex: 2,
                  width: '100%',
                  height: '400px',
                  overflow: 'hidden'
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: { xs: 12, md: 20 }, mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box 
              sx={{ 
                bgcolor: 'transparent',
                overflow: 'hidden',
                borderRadius: '24px',
                boxShadow: 'none',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                mb: 4,
                transition: 'all 0.3s ease-in-out',
                '& .swiper-pagination-bullet': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  opacity: 0.7,
                  width: '10px',
                  height: '10px',
                },
                '& .swiper-pagination-bullet-active': {
                  backgroundColor: '#fff',
                  opacity: 1,
                },
                '& .swiper-pagination': {
                  position: 'absolute',
                  bottom: '20px !important',
                  left: '0px !important',
                  width: '100% !important'
                },
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                }
              }}
            >
              <Swiper
                modules={[Autoplay, Pagination, EffectCreative]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                speed={800}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                effect="creative"
                creativeEffect={{
                  prev: {
                    shadow: false,
                    translate: [0, 0, -100],
                    opacity: 0,
                    scale: 0.95,
                  },
                  next: {
                    shadow: false,
                    translate: [0, 0, 0],
                    opacity: 1,
                    scale: 1,
                  },
                }}
              >
                {screenshotImages.map((src, index) => (
                  <SwiperSlide key={index}>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block',
                      }}
                    >
                      <Box
                        component="img"
                        src={src}
                        alt={`DiggiClass Screenshot ${index + 1}`}
                        sx={{ 
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          borderRadius: '24px',
                        }}
                      />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '1.5rem', md: '1.8rem' },
                mb: 1,
                color: 'white',
              }}
            >
              See DiggiClass in Motion
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              From student data to performance analytics—everything, in one place.
            </Typography>

          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection; 