import { styled, TableCell } from '@plentyag/brand-ui/src/material-ui/core';

export const IrrigationTableCell = styled(TableCell)(() => ({
  borderBottom: 'unset',
}));

export const LocationTableCell = styled(TableCell)(() => ({
  borderBottom: 'unset',
  wordBreak: 'break-word', // allow word break since location can be long
}));
