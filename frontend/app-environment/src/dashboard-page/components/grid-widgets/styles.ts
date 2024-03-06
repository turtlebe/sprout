import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';

interface StyleProps {
  canDrag: boolean;
  rowsCount: number;
  columnsCount: number;
  fullWidth: boolean;
}

export const useStyles = makeStyles(theme => ({
  grid: {
    margin: '8px',
    padding: '8px',
    display: 'grid',
    rowGap: '8px',
    columnGap: '8px',
    gridTemplateRows: ({ rowsCount }: StyleProps) => `repeat(${rowsCount}, minmax(100px, max-content))`,
    gridTemplateColumns: ({ columnsCount }: StyleProps) => `repeat(${columnsCount}, 300px)`,
    border: ({ canDrag }: StyleProps) => (canDrag ? `2px ${theme.palette.grey[300]} dashed` : ''),
  },
  gridFullWidgth: {
    margin: '8px',
    padding: '8px',
    display: 'grid',
    rowGap: '8px',
    border: ({ canDrag }: StyleProps) => (canDrag ? `2px ${theme.palette.grey[300]} dashed` : ''),
    gridTemplateColumns: '1fr',
  },
}));
