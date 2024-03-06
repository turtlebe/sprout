import { styled, TableCell, TableRow, TableRowProps, Theme } from '@plentyag/brand-ui/src/material-ui/core';

export const TableHeaderCellStyled = styled(TableCell)(() => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
}));

export const TableCellStyled = styled(TableCell)(() => ({
  height: '40px',
}));

interface TableRowStyled extends TableRowProps {
  active?: 'true';
}
export const TableRowStyled = styled(TableRow)<Theme, TableRowStyled>(({ theme, active }) => ({
  background: active === 'true' ? theme.palette.grey[100] : 'inherit',
}));
