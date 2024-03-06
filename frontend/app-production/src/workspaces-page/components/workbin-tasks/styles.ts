import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  searchCard: {
    marginBottom: '10px',
    flex: '0 0 auto',
  },
  searchCardContent: {
    padding: '1rem',
  },
  tasksContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '10px',
    columnGap: '10px',
  },
  taskListContainer: {
    flex: '1 1',
    minWidth: '500px',
  },
}));
