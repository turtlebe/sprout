import { LegendColor } from '@plentyag/app-environment/src/common/components/legend-color';
import { getColorGenerator, getCommonParentPath } from '@plentyag/app-environment/src/common/utils';
import { Box, Checkbox } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRuleType, Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

import { UseDashboardGraphStateReturn } from '../../hooks';

const dataTestIds = {
  allDataCheckbox: 'graph-metrics-settings-all-data-checkbox',
  allSpecLimitCheckbox: 'graph-metrics-settings-all-spec-limit-checkbox',
  allControlLimitCheckbox: 'graph-metrics-settings-all-control-limit-checkbox',
  label: (metric: Metric) => `graph-metrics-settings-label-${metric.id}`,
  dataCheckbox: (metric: Metric) => `graph-metrics-settings-data-checkbox-${metric.id}`,
  specLimitCheckbox: (metric: Metric) => `graph-metrics-settings-spec-limit-checkbox-${metric.id}`,
  controlLimitCheckbox: (metric: Metric) => `graph-metrics-settings-control-limit-checkbox-${metric.id}`,
};

export { dataTestIds as dataTestIdsGraphMetricsSettings };

export interface GraphMetricsSettings {
  metrics: Metric[];
  state: UseDashboardGraphStateReturn['state'];
  onShowAllData: UseDashboardGraphStateReturn['setShowAllData'];
  onShowAllSpecLimits: UseDashboardGraphStateReturn['setShowAllSpecLimits'];
  onShowAllControlLimits: UseDashboardGraphStateReturn['setShowAllControlLimits'];
  onShowData: UseDashboardGraphStateReturn['setShowData'];
  onShowControlLimit: UseDashboardGraphStateReturn['setShowControlLimit'];
  onShowSpecLimit: UseDashboardGraphStateReturn['setShowSpecLimit'];
}

/**
 * Allow to hide/show Data, Spec Limit, Control Limit each or all of given Metrics.
 */
export const GraphMetricsSettings: React.FC<GraphMetricsSettings> = ({
  metrics,
  state,
  onShowAllData,
  onShowAllSpecLimits,
  onShowAllControlLimits,
  onShowData,
  onShowControlLimit,
  onShowSpecLimit,
}) => {
  const colorGenerator = getColorGenerator();
  const TdAligned = ({ children }) => <td style={{ textAlign: 'center' }}>{children}</td>;
  const { remainingPaths } = getCommonParentPath(metrics);

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th></th>
          <th>Data</th>
          <th>Spec.</th>
          <th>Cont.</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>All:</td>
          <TdAligned>
            <Checkbox
              size="small"
              checked={Object.keys(state.metrics).every(metricId => state.metrics[metricId].showData)}
              onChange={e => onShowAllData(e.currentTarget.checked)}
              data-testid={dataTestIds.allDataCheckbox}
            />
          </TdAligned>
          <TdAligned>
            <Checkbox
              size="small"
              checked={Object.keys(state.metrics).every(metricId => state.metrics[metricId].showSpecLimit)}
              onChange={e => onShowAllSpecLimits(e.currentTarget.checked)}
              data-testid={dataTestIds.allSpecLimitCheckbox}
            />
          </TdAligned>
          <TdAligned>
            <Checkbox
              size="small"
              checked={Object.keys(state.metrics).every(metricId => state.metrics[metricId].showControlLimit)}
              onChange={e => onShowAllControlLimits(e.currentTarget.checked)}
              data-testid={dataTestIds.allControlLimitCheckbox}
            />
          </TdAligned>
        </tr>
        {metrics.map((metric, index) => (
          <tr key={metric.id}>
            <td>
              <Box display="flex" alignItems="center" data-testid={dataTestIds.label(metric)}>
                <LegendColor backgroundColor={colorGenerator.next().value[0]} />
                &nbsp; {remainingPaths[index]} - {metric.observationName}:
              </Box>
            </td>
            <TdAligned>
              <Checkbox
                size="small"
                checked={state.metrics[metric.id]?.showData ?? true}
                onChange={e => onShowData(metric.id, e.currentTarget.checked)}
                data-testid={dataTestIds.dataCheckbox(metric)}
              />
            </TdAligned>
            <TdAligned>
              {!Boolean(
                metric.alertRules.find(alertRule =>
                  [AlertRuleType.specLimit, AlertRuleType.specLimitDevices].includes(alertRule.alertRuleType)
                )
              ) ? (
                <Checkbox size="small" disabled data-testid={dataTestIds.specLimitCheckbox(metric)} />
              ) : (
                <Checkbox
                  size="small"
                  checked={state.metrics[metric.id]?.showSpecLimit ?? true}
                  onChange={e => onShowSpecLimit(metric.id, e.currentTarget.checked)}
                  data-testid={dataTestIds.specLimitCheckbox(metric)}
                />
              )}
            </TdAligned>
            <TdAligned>
              {!Boolean(metric.alertRules.find(alertRule => alertRule.alertRuleType === AlertRuleType.controlLimit)) ? (
                <Checkbox size="small" disabled data-testid={dataTestIds.controlLimitCheckbox(metric)} />
              ) : (
                <Checkbox
                  size="small"
                  checked={state.metrics[metric.id]?.showControlLimit ?? true}
                  onChange={e => onShowControlLimit(metric.id, e.currentTarget.checked)}
                  data-testid={dataTestIds.controlLimitCheckbox(metric)}
                />
              )}
            </TdAligned>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
