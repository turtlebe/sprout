import { Show } from '@plentyag/brand-ui/src/components';
import { Card, CardContent, CardHeader, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    title: 'title',
    emptyContent: 'empty-content',
  },
  'DashboardCard'
);

export { dataTestIds as dataTestIdsDashboardCard };

export interface DashboardCard {
  title: string;
  contentLength: number;
}

export const DashboardCard: React.FC<DashboardCard> = ({ title, contentLength, children }) => {
  return (
    <Card variant="outlined">
      <CardHeader data-testid={dataTestIds.title} title={<Typography variant="h6">{title}</Typography>} />
      <CardContent>
        <Show when={!contentLength}>
          <Typography data-testid={dataTestIds.emptyContent}>The {title} is empty.</Typography>
        </Show>
        <Show when={contentLength > 0}>{children}</Show>
      </CardContent>
    </Card>
  );
};
