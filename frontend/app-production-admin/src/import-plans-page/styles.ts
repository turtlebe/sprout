import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  subContent: {
    borderRadius: '8px',
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    background: theme.palette.grey[100],
  },
  subContentActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));
