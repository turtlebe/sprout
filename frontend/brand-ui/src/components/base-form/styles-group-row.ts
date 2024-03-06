import { DEFAULT_COLLASPED_DRAWER_WIDTH } from '@plentyag/brand-ui/src/components/side-nav-layout/collapsable-drawer';
import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  isLoading?: boolean;
}

export const useStyles = makeStyles(theme => ({
  form: {
    padding: theme.spacing(2),
    paddingLeft: DEFAULT_COLLASPED_DRAWER_WIDTH,
    flex: '1 1 auto',
    overflowY: 'auto',
  },
  input: {
    width: '100%',
  },
  inputContainer: {
    [theme.breakpoints.up('md')]: { width: '550px' },
    [theme.breakpoints.down('sm')]: { width: '100%' },
    marginBottom: '0.5rem',
    background: 'white',
    padding: '1rem',
    borderRadius: '2px',
    border: `1px solid ${theme.palette.grey[200]}`,
    marginRight: '0.5rem',
  },
  inputContainerInGroup: {
    [theme.breakpoints.up('md')]: { width: '550px' },
    [theme.breakpoints.down('sm')]: { width: '100%' },
    marginBottom: '0.5rem',
    marginRight: '1rem',
  },
  groupContainer: {},
  nestedGroupContainer: {},
  groupRow: {
    marginBottom: '0.5rem',
    background: 'white',
    padding: '1rem',
    borderRadius: '2px',
    border: `1px solid ${theme.palette.grey[200]}`,
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
  groupItem: {
    display: 'flex',
  },
  groupInputs: {
    display: 'flex',
  },
  titleContainer: {
    [theme.breakpoints.up('md')]: { width: '550px' },
    [theme.breakpoints.down('sm')]: { width: 'calc(100% - 2rem)' },
  },
  linearProgress: {
    flex: '0 0 auto',
    visibility: (props: StyleProps) => (props.isLoading ? 'visible' : 'hidden'),
  },
  baseFormFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.grey[300]}`,
    padding: theme.spacing(4),
    position: 'relative',
  },
}));
