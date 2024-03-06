import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

import { commonStyles } from './common-styles';

export const useStyles = makeStyles(theme => ({
  ...commonStyles(theme),
  '@global': {
    '::-webkit-scrollbar-thumb': {
      'border-radius': '4px',
      'background-color': 'rgba(0, 0, 0, 0.5)',
      'box-shadow': '0 0 1px rgba(255, 255, 255, 0.5)',
    },
    '::-webkit-scrollbar': {
      '-webkit-appearance': 'none',
      width: '6px',
      height: '6px',
    },
  },
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  progress: {
    flex: '0 0 auto',
  },
  header: {
    margin: theme.spacing(1),
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    alignSelf: 'center',
  },
  resultsButtonContainer: {
    marginLeft: 'auto',
    alignSelf: 'center',
  },
  form: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    flex: '1 1',
    margin: theme.spacing(1),
    overflow: 'hidden',
  },
  bodyMessage: {
    textAlign: 'center',
  },
  scroller: {
    overflow: 'auto',
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    float: 'right',
  },
}));
