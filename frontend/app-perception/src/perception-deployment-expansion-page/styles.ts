import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  finalDisplayResult: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  circularProgress: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deploymentExpansionResults: {
    paddingTop: '1rem',
    paddingLeft: '2rem',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}));
