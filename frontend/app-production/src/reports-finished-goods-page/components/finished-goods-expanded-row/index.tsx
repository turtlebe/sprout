import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { PackagingLot } from '@plentyag/core/src/types';
import React from 'react';

import { SkusWithCount } from '../../hooks/use-process-finished-goods-data';
import { TestStatusField } from '../../types';
import { TestDetails } from '../test-details';

import { SkusTable } from './components/skus-table';
import { useStyles } from './styles';

const dataTestIds = {
  root: 'finished-goods-exp-row-root',
};

export { dataTestIds as dataTestIdsFinishedGoodsExpandedRow };

export interface FinishedGoodsExpandedRow {
  basePath: string;
  lot: PackagingLot;
  skus: SkusWithCount[];
}

export const FinishedGoodsExpandedRow: React.FC<FinishedGoodsExpandedRow> = ({ basePath, lot, skus }) => {
  const classes = useStyles({});

  return (
    <Box pl={6} className={classes.root} data-testid={dataTestIds.root}>
      <Box className={classes.layout}>
        <Box flex={1}>
          <SkusTable basePath={basePath} lot={lot} skus={skus} />
        </Box>
        <Box flex={1} className={classes.divider}>
          <TestDetails lot={lot} field={TestStatusField.QA} />
        </Box>
        <Box flex={1} className={classes.divider}>
          <TestDetails lot={lot} field={TestStatusField.LAB_TESTING} />
        </Box>
      </Box>
    </Box>
  );
};
