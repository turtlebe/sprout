import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(() => ({
  diagramContainer: {
    width: '100%',
    height: '100%',
    minHeight: '100px',
    overflow: 'auto',
    position: 'relative',
  },
  svgChart: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));
