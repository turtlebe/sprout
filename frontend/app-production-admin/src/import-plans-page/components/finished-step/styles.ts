import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  parameters: {
    background: 'white',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: '4px',
  },
  tableContainer: {
    background: 'white',
    maxHeight: 188,
    borderRadius: '6px',
  },
  tableHeader: {
    fontSize: '12px',
    fontWeight: 600,
    color: theme.palette.grey[600],
  },
}));
