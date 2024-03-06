import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    background: 'white',
    borderRadius: 4,
  },
  control: {
    padding: theme.spacing(2),
  },
  ruleLabel: {
    color: theme.palette.grey[600],
  },
  button: {
    color: theme.palette.grey[600],
  },
  arrow: {
    color: theme.palette.grey[500],
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  dropDown: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 150,
  },
  dropDownCondition: {
    backgroundColor: theme.palette.background.paper,
    minWidth: 350,
  },
}));
