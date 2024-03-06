import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { SkuObj } from '../../hooks';
import { TestStatusField } from '../../types';
import { LinkToPHQA } from '../link-to-phqa';
import { TestDetails } from '../test-details';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'finished-goods-exp-row-root',
};

export { dataTestIds as dataTestIdsSkusExpandedRow };

export interface SkusExpandedRow {
  data: SkuObj;
}

export const SkusExpandedRow: React.FC<SkusExpandedRow> = ({ data }) => {
  const classes = useStyles({});

  const { lot, sku, crop } = data;

  return (
    <Box pl={6} className={classes.root} data-testid={dataTestIds.root}>
      <Box className={classes.layout}>
        <Box flex={1}>
          <Typography variant="h6" className={classes.mainHeader}>
            {crop.displayName}
          </Typography>
          <Typography variant="subtitle2">Brand: {sku.brandTypeName}</Typography>
          <Typography variant="subtitle2">Crop: {crop.displayAbbreviation}</Typography>
          <Typography variant="subtitle2">Name: {sku.displayName}</Typography>
          <Typography variant="subtitle2">NetSuite Item ID: {sku.netsuiteItem}</Typography>
        </Box>
        <Box flex={1} className={classes.divider}>
          <TestDetails lot={lot} sku={sku} field={TestStatusField.QA} />
          <LinkToPHQA sku={sku} lot={lot} />
        </Box>
        <Box flex={1} className={classes.divider}>
          <TestDetails lot={lot} sku={sku} field={TestStatusField.LAB_TESTING} />
        </Box>
      </Box>
    </Box>
  );
};
