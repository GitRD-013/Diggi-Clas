import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

interface ResponsiveTableContainerProps extends BoxProps {
  children: ReactNode;
}

const ResponsiveTableContainer = ({ children, ...props }: ResponsiveTableContainerProps) => {
  return (
    <Box 
      sx={{
        width: '100%',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(124, 58, 237, 0.5)',
          borderRadius: '4px',
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveTableContainer; 