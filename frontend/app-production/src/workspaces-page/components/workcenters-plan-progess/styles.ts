import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  isLoading?: boolean;
}

export const useStyles = makeStyles(() => ({
  progress: {
    alignSelf: 'center',
    visibility: (props: StyleProps) => (props.isLoading ? 'visible' : 'hidden'),
  },
  workcenterProgressListContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '10px',
    columnGap: '10px',
  },
  workcenterProgessContainer: {
    flex: '1 1',
    minWidth: '500px',
  },
}));
