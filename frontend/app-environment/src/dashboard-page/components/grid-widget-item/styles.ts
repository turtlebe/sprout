import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  canDrag: boolean;
}

export const useStyles = makeStyles(() => ({
  moveHandle: {
    '&:hover': {
      cursor: ({ canDrag }: StyleProps) => (canDrag ? 'move' : ''),
    },
  },
  resizeHandle: {
    position: 'absolute',
    right: '0',
    bottom: '0',
    top: '0',
    width: '1rem',
    '&:hover': {
      cursor: ({ canDrag }: StyleProps) => (canDrag ? 'col-resize' : ''),
    },
  },
}));
