import React from 'react';
import { Box, BoxProps, Table, TableProps } from '@mui/material';

interface ResponsiveTableWrapperProps extends BoxProps {
  children: React.ReactNode;
  minWidth?: number | string;
}

/**
 * A responsive wrapper for tables that provides horizontal scrolling on small screens
 */
export const ResponsiveTableWrapper = ({ 
  children, 
  minWidth = '750px',
  ...props 
}: ResponsiveTableWrapperProps) => {
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
      <Box sx={{ minWidth }}>
        {children}
      </Box>
    </Box>
  );
};

/**
 * A responsive table component that wraps the MUI Table
 * to provide horizontal scrolling on small screens
 */
export const ResponsiveTable = ({ 
  children, 
  minWidth = '750px',
  ...props 
}: TableProps & { minWidth?: number | string }) => {
  return (
    <ResponsiveTableWrapper minWidth={minWidth}>
      <Table {...props}>
        {children}
      </Table>
    </ResponsiveTableWrapper>
  );
};

/**
 * Utility to apply responsive styles to MUI Tables
 */
export const applyResponsiveTableStyles = (tableProps: TableProps = {}) => {
  return {
    size: 'small',
    stickyHeader: true,
    ...tableProps,
    sx: {
      borderCollapse: 'separate',
      borderSpacing: 0,
      '& .MuiTableHead-root': {
        position: 'sticky',
        top: 0,
        zIndex: 1,
      },
      '& .MuiTableCell-head': {
        fontWeight: 600,
        whiteSpace: 'nowrap',
        background: 'rgba(18, 18, 40, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      },
      '& .MuiTableCell-root': {
        borderColor: 'rgba(255, 255, 255, 0.05)',
      },
      '& .MuiTableBody-root .MuiTableRow-root:hover': {
        backgroundColor: 'rgba(124, 58, 237, 0.08)',
      },
      ...tableProps.sx,
    },
  };
}; 