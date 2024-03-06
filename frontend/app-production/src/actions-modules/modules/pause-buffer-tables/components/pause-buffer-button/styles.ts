import { alpha, makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

const red = '#f44336';
const green = '#4caf50';

export const useStyles = makeStyles(() => ({
  playButton: {
    backgroundColor: alpha(green, 0.15),
    '&:hover': {
      backgroundColor: alpha(green, 0.25),
    },
  },
  pauseButton: {
    backgroundColor: alpha(red, 0.15),
    '&:hover': {
      backgroundColor: alpha(red, 0.25),
    },
  },
}));
