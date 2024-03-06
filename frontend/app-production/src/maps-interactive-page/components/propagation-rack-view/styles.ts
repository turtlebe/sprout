import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  graphContainer: {
    flex: '1 1 0',
    overflow: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, fit-content(100%))',
    gridTemplateRows: 'auto auto',
  },
  headLift: {
    margin: '0 1rem 1rem 0',
    alignSelf: 'stretch',
    gridColumnStart: 1,
    gridColumnEnd: 1,
    gridRowStart: 1,
  },
  buffer: {
    margin: '1rem 1rem 1rem 0',
    alignSelf: 'stretch',
    gridColumnStart: 1,
    gridRowStart: 2,
  },
  machines: {
    gridColumnStart: 2,
    gridRow: '1/ span 2',
    display: 'flex',
    flexDirection: 'column',
  },
  machineContainer: {
    flex: '1 1 auto',
  },
  tailLift: {
    margin: '0 0 1rem 1rem',
    alignSelf: 'stretch',
    gridColumnStart: 3,
    gridRow: '1/ span 2',
  },
}));
