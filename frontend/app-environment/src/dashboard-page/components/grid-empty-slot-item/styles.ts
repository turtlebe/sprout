import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  isOver: boolean;
}

export const useStyles = makeStyles(theme => ({
  gridEmptySlotItem: {
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderColor: (props: StyleProps) => (props.isOver ? theme.palette.primary.main : theme.palette.grey[300]),
    minHeight: '100px',
    height: '100%',
    zIndex: 9999,
  },
}));
