import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  isLoading?: boolean;
}

export const useStyles = makeStyles(theme => ({
  linearProgress: {
    flex: '0 0 auto',
    visibility: (props: StyleProps) => (props.isLoading ? 'visible' : 'hidden'),
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  tabsContainer: {
    flex: '1 1 auto',
  },
  tabsFlexContainer: {
    justifyContent: 'space-around',
  },
  tabWrapped: {
    [theme.breakpoints.down('md')]: {
      maxWidth: '100px',
      minWidth: '100px',
    },
  },
  openCloseToggle: {
    transform: 'translate(0, 1.5rem)',
    alignSelf: 'center',
  },
  stickyContainer: {
    backgroundColor: theme.palette.grey[200],
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  tabPanelContainer: {
    zIndex: 0, // ensure lower than sticky container so panel content does not appear above sticky container
    margin: theme.spacing(4),
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
  },
}));
