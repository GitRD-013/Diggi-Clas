import { Button, ButtonProps, styled } from '@mui/material';

const ResponsiveButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.4s ease',
  },
  '&:hover': {
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
    '&::before': {
      transform: 'translateX(0)',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '8px 16px',
    fontSize: '0.85rem',
    borderRadius: '8px',
    '&:hover': {
      transform: 'translateY(-1px)',
    },
  },
  [theme.breakpoints.only('sm')]: {
    padding: '9px 20px',
    fontSize: '0.9rem',
    borderRadius: '10px',
  },
}));

export default ResponsiveButton; 