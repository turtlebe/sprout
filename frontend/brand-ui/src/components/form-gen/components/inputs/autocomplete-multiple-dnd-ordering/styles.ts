import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  dndContainer: {
    border: '1px dashed gray',
    padding: '0.5rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
    display: 'flex',
    width: '100%',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dndDragIndicatorIcon: {
    height: '100%',
    marginLeft: '5px',
    marginRight: '15px',
  },
  dndText: {
    marginRight: 'auto',
  },
  dndTooltip: {
    height: '100%',
    marginRight: '5px',
  },
  divider: {
    margin: '5px',
  },
  dndInput: {
    width: '100%',
  },
  subtitleText: {
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 0,
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1,
    marginBottom: '5px',
  },
}));
