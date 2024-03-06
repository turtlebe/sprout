import { ChevronRight, Delete } from '@material-ui/icons';
import { Grid, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

import { dataTestIdsListMetrics, ListMetrics } from '../list-metrics';

const dataTestIds = {
  ...dataTestIdsListMetrics,
  options: 'transfer-list-options',
  selected: 'transfer-list-selected',
};

export { dataTestIds as dataTestIdsTransferList };

export interface TransferList {
  options: Metric[];
  selected: Metric[];
  onChange: (metrics: Metric[]) => void;
}

/**
 * Show two <ListMetrics />:
 *  - The right list shows Metrics that been selected.
 *  - The left list shows Metrics that are selectable.
 */
export const TransferList: React.FC<TransferList> = ({ options, selected, onChange }) => {
  const [right, setRight] = React.useState<Metric[]>(selected);

  const handleAddMetric = (metric: Metric) => {
    const newRight = [metric, ...right];

    setRight(newRight);
    onChange(newRight);
  };

  const handleRemoveMetric = (metric: Metric) => {
    const index = right.findIndex(m => m.id === metric.id);
    const newRight = [...right.slice(0, index), ...right.slice(index + 1)];

    setRight(newRight);
    onChange(newRight);
  };

  const rightIds = React.useMemo(() => right.map(metric => metric.id), [right]);
  const leftWithoutRight = React.useMemo(
    () => options.filter(metric => !rightIds.includes(metric.id)),
    [options, rightIds]
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={6} data-testid={dataTestIds.options}>
        <Typography>Available Metrics:</Typography>
        <ListMetrics metrics={leftWithoutRight} onClick={handleAddMetric} icon={ChevronRight} />
      </Grid>
      <Grid item xs={6} data-testid={dataTestIds.selected}>
        <Typography>Selected Metrics:</Typography>
        <ListMetrics metrics={right} onClick={handleRemoveMetric} icon={Delete} />
      </Grid>
    </Grid>
  );
};
