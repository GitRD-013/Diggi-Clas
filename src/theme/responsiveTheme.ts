import { Theme, ThemeOptions } from '@mui/material/styles';

// This function enhances a theme with responsive typography and spacing
export const enhanceThemeWithResponsiveness = (theme: Theme): ThemeOptions => {
  return {
    ...theme,
    typography: {
      ...theme.typography,
      h1: {
        ...theme.typography.h1,
        fontSize: '2.5rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '3rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '3.5rem',
        },
        [theme.breakpoints.up('lg')]: {
          fontSize: '4rem',
        },
      },
      h2: {
        ...theme.typography.h2,
        fontSize: '2rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '2.25rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '2.5rem',
        },
        [theme.breakpoints.up('lg')]: {
          fontSize: '2.75rem',
        },
      },
      h3: {
        ...theme.typography.h3,
        fontSize: '1.75rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '1.85rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '2rem',
        },
        [theme.breakpoints.up('lg')]: {
          fontSize: '2.25rem',
        },
      },
      h4: {
        ...theme.typography.h4,
        fontSize: '1.5rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '1.6rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '1.75rem',
        },
        [theme.breakpoints.up('lg')]: {
          fontSize: '1.9rem',
        },
      },
      h5: {
        ...theme.typography.h5,
        fontSize: '1.25rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '1.35rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '1.5rem',
        },
      },
      h6: {
        ...theme.typography.h6,
        fontSize: '1.1rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '1.15rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '1.25rem',
        },
      },
      body1: {
        ...theme.typography.body1,
        fontSize: '0.95rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '1rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '1.05rem',
        },
      },
      body2: {
        ...theme.typography.body2,
        fontSize: '0.85rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '0.9rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '0.95rem',
        },
      },
      button: {
        ...theme.typography.button,
        fontSize: '0.85rem',
        [theme.breakpoints.up('sm')]: {
          fontSize: '0.9rem',
        },
        [theme.breakpoints.up('md')]: {
          fontSize: '0.95rem',
        },
      },
    },
    components: {
      ...theme.components,
      MuiContainer: {
        styleOverrides: {
          root: {
            [theme.breakpoints.down('sm')]: {
              padding: '0 16px',
            },
            [theme.breakpoints.between('sm', 'md')]: {
              padding: '0 24px',
            },
            [theme.breakpoints.up('md')]: {
              padding: '0 32px',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            [theme.breakpoints.down('sm')]: {
              padding: '12px 8px',
              fontSize: '0.8rem',
            },
            [theme.breakpoints.between('sm', 'md')]: {
              padding: '14px 12px',
              fontSize: '0.85rem',
            },
            [theme.breakpoints.up('md')]: {
              padding: '16px',
              fontSize: '0.9rem',
            },
          },
        },
      },
    },
  };
};

export default enhanceThemeWithResponsiveness; 