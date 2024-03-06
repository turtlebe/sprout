import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  deploymentHeader: {
    marginLeft: '30px',
  },
  circularProgress: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardErrorMessage: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deploymentStatusCircle: {
    borderRadius: 7.0,
    height: 14.0,
    width: 14.0,
    padding: 0,
    margin: 15.0,
    backgroundColor: 'green',
  },
}));
