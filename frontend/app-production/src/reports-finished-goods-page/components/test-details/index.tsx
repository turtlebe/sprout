import { TestStatusProperties } from '@plentyag/app-production/src/reports-finished-goods-page/constants';
import { TestStatusField } from '@plentyag/app-production/src/reports-finished-goods-page/types';
import { getReleaseDetails } from '@plentyag/app-production/src/reports-finished-goods-page/utils/get-release-details';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefSku } from '@plentyag/core/src/farm-def/types';
import { PackagingLot } from '@plentyag/core/src/types';
import { getRelativeTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import React from 'react';

import { TestStatus } from '../test-status';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'test-details-root',
  status: 'test-details-status',
  notes: 'test-details-notes',
};

export { dataTestIds as dataTestIdsTestDetails };

export interface TestDetails {
  lot: PackagingLot;
  sku?: FarmDefSku;
  field: TestStatusField;
}

export const TestDetails: React.FC<TestDetails> = ({ lot, sku, field }) => {
  const { passedStatus, overriddenStatus, overriddenAuthor, overriddenNotes, overriddenUpdatedAt } =
    TestStatusProperties[field];

  const title = field === TestStatusField.QA ? 'QA Testing Details' : 'Lab Testing Details';

  const releaseDetails = getReleaseDetails(lot, sku);

  const overrideUpdatedAt = releaseDetails[overriddenUpdatedAt]
    ? getRelativeTime(DateTime.fromISO(releaseDetails[overriddenUpdatedAt]).toJSDate())
    : '';

  const classes = useStyles({});

  return (
    <Box data-testid={dataTestIds.root}>
      <Box className={classes.title}>{title}</Box>
      <Box className={classes.content}>
        <TestStatus
          status={releaseDetails[passedStatus]}
          overriddenStatus={releaseDetails[overriddenStatus]}
          data-testid={dataTestIds.status}
        />
        <Show when={Boolean(releaseDetails?.[overriddenNotes]?.length > 0)}>
          <Typography className={classes.paragraph} data-testid={dataTestIds.notes}>
            {releaseDetails[overriddenNotes]}
            <span className={classes.byline}>
              &mdash;Updated
              <Show when={Boolean(overrideUpdatedAt.length > 0)}> {overrideUpdatedAt}</Show> by{' '}
              {releaseDetails[overriddenAuthor]}
            </span>
          </Typography>
        </Show>
      </Box>
    </Box>
  );
};
