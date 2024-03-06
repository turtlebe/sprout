import { CardItem } from '@plentyag/brand-ui/src/components/card-item';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { PartialColDef } from '../../types';

import { useStyles } from './styles';

const dataTestIds = {
  textField: 'crop-sku-card-item-text-field',
  jsxField: 'crp-sku-card-item-jsx-field',
};
export { dataTestIds as dataTestIdsCropSkuCardItem };

export interface CropSkuCardItem {
  tableCol: PartialColDef;
  value: string | JSX.Element;
}

export const CropSkuCardItem: React.FC<CropSkuCardItem> = ({ tableCol, value }) => {
  const classes = useStyles({ value });
  const tooltip = <Typography>{tableCol.headerTooltip}</Typography>;
  return (
    <CardItem name={tableCol.headerName} tooltip={tooltip}>
      {!value || typeof value === 'string' ? (
        <Typography data-testid={dataTestIds.textField} className={classes.textField}>
          {value || 'none'}
        </Typography>
      ) : (
        <Box data-testid={dataTestIds.jsxField}>{value}</Box>
      )}
    </CardItem>
  );
};
