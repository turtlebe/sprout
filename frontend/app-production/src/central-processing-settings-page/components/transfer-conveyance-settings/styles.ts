import { makeStyles } from '@material-ui/core/styles';

interface StyleProps {
  isLoading?: boolean;
}

export const useStyles = makeStyles(theme => ({
  linearProgress: {
    flex: '0 0 auto',
    visibility: (props: StyleProps) => (props.isLoading ? 'visible' : 'hidden'),
  },
  header: {
    paddingBottom: theme.spacing(2),
  },
  tabPanel: {
    height: '100%',
  },
  tabSelected: {
    background: 'white',
  },
  title: {
    color: theme.palette.grey[800],
    marginLeft: '0.75rem',
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  subTitle: {
    fontSize: theme.typography.subtitle2.fontSize,
    color: theme.palette.grey[600],
    fontWeight: theme.typography.fontWeightBold,
  },
  groupTitle: {
    fontSize: '0.85rem',
    color: theme.palette.grey[600],
  },
  group: {
    background: 'white',
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    borderRadius: 4,
  },
  groupLevel1: {
    background: 'white',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    borderRadius: 8,
    boxShadow: theme.shadows[1],
  },
  groupLevel2: {
    background: theme.palette.grey[100],
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    borderRadius: 4,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    background: theme.palette.grey[200],
    position: 'relative',
  },
  actionButton: {
    color: theme.palette.grey[600],
  },
}));
