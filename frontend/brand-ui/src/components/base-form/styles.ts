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
    alignItems: 'center',
  },
  input: {
    width: '100%',
  },
  inputContainer: {
    width: '550px',
    marginBottom: '0.5rem',
    background: 'white',
    padding: '1rem',
    borderRadius: '2px',
    border: `1px solid ${theme.palette.grey[200]}`,
  },
  inputContainerInGroup: {
    width: '550px',
    marginBottom: '0.5rem',
    background: 'white',
    padding: '1rem',
    borderRadius: '2px',
    border: `1px solid ${theme.palette.grey[200]}`,
  },
  groupContainer: {
    '& > $groupRow': {
      padding: '1rem 0.5rem 0.5rem 0.5rem',
      '&:hover': { background: 'rgba(0,0,0,0.04)' },
    },
    marginBottom: '0.5rem',
    background: 'white',
    padding: '1rem',
    borderRadius: '2px',
    border: `1px solid ${theme.palette.grey[200]}`,
  },
  nestedGroupContainer: {},
  groupRow: {},
  groupItem: {
    display: 'flex',
  },
  groupInputs: {
    width: '100%',
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
