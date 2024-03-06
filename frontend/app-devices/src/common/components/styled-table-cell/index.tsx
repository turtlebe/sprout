import { TableCell, withStyles } from '@plentyag/brand-ui/src/material-ui/core';

export const StyledTableCell = withStyles(() => ({
  head: {
    fontWeight: 'bold',
    fontSize: 14,
  },
}))(TableCell);
