import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  container: {
    height: 'calc(100% - 4rem)',
    margin: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  tabsContainer: {
    flex: '1 1 auto',
  },
  tabsFlexContainer: {
    justifyContent: 'space-around',
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflow: 'auto',
  },
}));
