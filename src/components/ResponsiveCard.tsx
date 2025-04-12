import { Card, CardProps, styled } from '@mui/material';

const ResponsiveCard = styled(Card)<CardProps>(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '16px',
    padding: '1px',
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.03))',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '12px',
    '&::before': {
      borderRadius: '12px',
    },
    '&:hover': {
      transform: 'translateY(-3px)',
    },
  },
  [theme.breakpoints.only('sm')]: {
    padding: theme.spacing(2.5),
    borderRadius: '14px',
    '&::before': {
      borderRadius: '14px',
    },
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
}));

export default ResponsiveCard; 