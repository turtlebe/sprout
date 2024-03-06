import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    width: '100%',
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  containerIcon: {
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '3px',
  },
  figure: {
    display: 'block',
    width: '40px',
    height: '50px',
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1.5),
  },
  title: {
    display: 'block',
    textTransform: 'none',
    color: theme.palette.grey[800],
  },
  link: {
    display: 'block',
  },
}));
