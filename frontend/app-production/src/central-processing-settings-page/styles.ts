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
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    minHeight: 0,
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
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(4),
    position: 'relative',
  },
}));
