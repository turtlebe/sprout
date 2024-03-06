import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const FILL_COLOR = 'rgba(255, 255, 255, 0.20)';
export const MARKER_LENGTH = 10;

export const FONT_FAMILY = 'Arial';
export const FONT_SIZE = 16;
export const LINE_HEIGHT = 1.2;

export const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  stage: {
    background: 'transparent',
    position: 'absolute',
    top: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    minWidth: '0px',
    minHeight: '0px',
    objectFit: 'contain',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    visibillity: 'hidden',
  },
});
