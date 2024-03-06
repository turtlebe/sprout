import {
  getLiveStatusIconDataTestIds,
  LiveStatusIcon,
} from '@plentyag/app-environment/src/common/components/live-status-icon';
import { useGetLiveStatusColor, useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import {
  formatNonNumericalValue,
  formatNumericalValue,
  getAlertRuleLiveStatus,
  getRuleDetails,
  isNumericalMetric,
} from '@plentyag/app-environment/src/common/utils';
import { Show } from '@plentyag/brand-ui/src/components';
import { Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { AlertRule, LiveStatus, Metric, TimeSummarization } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

const dataTestIds = getScopedDataTestIds(
  {
    noData: 'no-data',
    liveStatus: getLiveStatusIconDataTestIds('live-status'),
  },
  'liveRuleValue'
);

export { dataTestIds as dataTestIdsLiveRuleValue };

export interface LiveRuleValue {
  metric: Metric;
  alertRule: AlertRule;
  at: Date;
  observation: RolledUpByTimeObservation;
}

export const LiveRuleValue: React.FC<LiveRuleValue> = ({ metric, alertRule, at, observation }) => {
  const { getPreferredUnit } = useUnitConversion();

  //  Computed Properties
  const timeSummarization = isNumericalMetric(metric) ? TimeSummarization.median : TimeSummarization.value;
  const formatValue = isNumericalMetric(metric) ? formatNumericalValue : formatNonNumericalValue;
  const unitSymbol = getPreferredUnit(metric.measurementType).symbol;
  const observationValue = observation ? observation[timeSummarization] : undefined;

  const color = useGetLiveStatusColor(getAlertRuleLiveStatus({ metric, alertRule, at, observationValue }));

  return (
    <Typography style={{ color }} data-testid={dataTestIds.root}>
      <Show
        when={Boolean(observation)}
        fallback={
          <LiveStatusIcon status={LiveStatus.noData} fontSize="small" data-testid={dataTestIds.liveStatus.root} />
        }
      >
        <Tooltip title={getRuleDetails({ metric, alertRule, at, unitSymbol })}>
          <span>{formatValue(observationValue, unitSymbol)}</span>
        </Tooltip>
      </Show>
    </Typography>
  );
};
