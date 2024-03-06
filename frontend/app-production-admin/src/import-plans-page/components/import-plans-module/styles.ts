import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  subContent: {
    borderRadius: '8px',
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    background: theme.palette.grey[100],
  },
  paper: {
    position: 'relative',
  },
  containedBackdrop: {
    position: 'absolute',
    zIndex: 99,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
}));
