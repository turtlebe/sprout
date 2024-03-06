import { getAlertRuleTypeLabel, getMeasurementTypeLabel } from '@plentyag/app-environment/src/common/utils';
import { Box, Chip } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule, Metric } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds, getShortenedPath } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    type: 'type',
    path: 'path',
    measurementTypeAndObservationName: 'measurement-type-and-observation',
    alertRule: 'alert-rule',
  },
  'chip-metric'
);

export { dataTestIds as dataTestIdsChipMetric };

export interface ChipMetric {
  metric: Metric;
  alertRule?: AlertRule;
}

export const ChipMetric: React.FC<ChipMetric> = ({ metric, alertRule }) => {
  return (
    <Box display="flex" alignItems="center" gridGap="0.5rem">
      <Chip label="Metric" color="secondary" data-testid={dataTestIds.type} />
      <Chip label={getShortenedPath(metric.path)} data-testid={dataTestIds.path} />
      <Chip
        label={`${getMeasurementTypeLabel(metric.measurementType)}: ${metric.observationName}`}
        data-testid={dataTestIds.measurementTypeAndObservationName}
      />
      {alertRule && (
        <Chip
          label={`${getAlertRuleTypeLabel(alertRule.alertRuleType)} - ${alertRule.description}`}
          data-testid={dataTestIds.alertRule}
        />
      )}
    </Box>
  );
};
