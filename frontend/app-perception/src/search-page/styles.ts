import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nav: {
    height: '100%',
    width: '10%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    marginTop: '20px',
    listStyleType: 'none',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
  },
  results: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    flex: '1',
  },
  form: {
    width: '15%',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'auto',
  },
}));
