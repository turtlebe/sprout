import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  numSlots: number;
}

export const useStyles = makeStyles(() => ({
  diagramContainer: {
    height: '80px',
    width: (props: StyleProps) => `${props.numSlots * 50}px`,
    overflow: 'visible',
    position: 'relative',
  },
}));
