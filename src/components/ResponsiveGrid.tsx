import { Grid, GridProps, styled } from '@mui/material';

interface ResponsiveGridProps extends GridProps {
  itemSpacing?: number;
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
}

const ResponsiveGrid = styled(Grid)<ResponsiveGridProps>(
  ({ 
    theme, 
    itemSpacing = 3, 
    mobileColumns = 1, 
    tabletColumns = 2, 
    desktopColumns = 3 
  }) => ({
    width: '100%',
    margin: 0,
    '& .MuiGrid-item': {
      [theme.breakpoints.down('sm')]: {
        flexBasis: `${100 / mobileColumns}%`,
        maxWidth: `${100 / mobileColumns}%`,
      },
      [theme.breakpoints.between('sm', 'md')]: {
        flexBasis: `${100 / tabletColumns}%`,
        maxWidth: `${100 / tabletColumns}%`,
      },
      [theme.breakpoints.up('md')]: {
        flexBasis: `${100 / desktopColumns}%`,
        maxWidth: `${100 / desktopColumns}%`,
      },
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      '& > .MuiGrid-item': {
        padding: theme.spacing(itemSpacing * 0.6),
      },
    },
    [theme.breakpoints.only('sm')]: {
      padding: theme.spacing(2),
      '& > .MuiGrid-item': {
        padding: theme.spacing(itemSpacing * 0.8),
      },
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
      '& > .MuiGrid-item': {
        padding: theme.spacing(itemSpacing),
      },
    },
  })
);

export default ResponsiveGrid; 