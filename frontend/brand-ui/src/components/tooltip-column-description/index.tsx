import { DialogFormGenTooltip } from '@plentyag/brand-ui/src/components';
import { Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { get } from 'lodash';
import React from 'react';

export type PartialColDef = Pick<ColDef, 'headerName' | 'field' | 'colId' | 'headerTooltip'>;

export interface PartialColDefs {
  [name: string]: PartialColDef;
}

export const TooltipColumnDescription: React.FC<FormGen.TooltipProps> = props => {
  const { tableCols } = props.context ?? {};
  const name = props.formGenField['name'];
  const col: PartialColDef = name && get(tableCols, name);
  const title = col?.headerName || 'No description available';
  const descriptionText = col?.headerTooltip || 'Sorry, no description is available.';

  return (
    <DialogFormGenTooltip title={title} {...props}>
      <Typography>{descriptionText}</Typography>
    </DialogFormGenTooltip>
  );
};
