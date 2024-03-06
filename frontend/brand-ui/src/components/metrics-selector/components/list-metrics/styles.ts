import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  paper: {
    height: 500,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  subheader: {
    backgroundColor: 'white',
  },
  icon: {
    minWidth: 'unset',
  },
}));
