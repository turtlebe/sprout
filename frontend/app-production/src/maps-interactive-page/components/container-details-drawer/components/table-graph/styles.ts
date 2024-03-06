import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const useStyles = makeStyles(theme => ({
  diagramContainer: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    position: 'relative',
  },
  svgChart: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  irrigationSuccessBox: {
    float: 'right',
    background: theme.palette.success.light,
  },
  irrigationPendingBox: {
    float: 'right',
    background: theme.palette.grey[300],
  },
  irrigationStatusIconWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  irrigationTypeIconWrapper: {
    position: 'relative',
    top: '0px',
    left: '0px',
  },
}));
