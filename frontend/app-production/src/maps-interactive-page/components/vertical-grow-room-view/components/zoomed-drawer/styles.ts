import { DRAWER_TRANSITION_SPEED } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface DrawerProps {
  show: boolean;
}

export const useStyles = makeStyles(theme => ({
  drawer: {
    height: (props: DrawerProps) => (props.show ? '300px' : '1px'),
    position: 'relative',
    background: 'white',
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    transition: `height ${DRAWER_TRANSITION_SPEED}ms`,
    boxShadow: theme.shadows[24],
  },
  drawerPaper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  closeIcon: {
    marginTop: theme.spacing(0.5),
  },
}));
