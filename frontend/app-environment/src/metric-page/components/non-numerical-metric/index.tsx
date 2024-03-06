import {
  ButtonCreateAlertRule,
  InactiveChip,
  MetricGraphNonNumerical,
  TabLabelAlertEvents,
  TabLabelAlertRule,
  TableNonNumericalAlertRuleReadOnly,
} from '@plentyag/app-environment/src/common/components';
import {
  useFetchNonNumericalObservations,
  useLocalStorageDataInterpolation,
  useMetricTabs,
} from '@plentyag/app-environment/src/common/hooks';
import { DEFAULT_TIME_GRANULARITY_NON_NUMERICAL as DEFAULT_TIME_GRANULARITY } from '@plentyag/app-environment/src/common/utils/constants';
import { Show, TabPanel } from '@plentyag/brand-ui/src/components';
import { Box, Card, Divider, Tab, Tabs } from '@plentyag/brand-ui/src/material-ui/core';
import { TabType, TimeGranularity } from '@plentyag/core/src/types/environment';
import React from 'react';

import { dataTestIdsNumericalMetric, NumericalMetric } from '../numerical-metric';
import { TableAlertEvents } from '../table-alert-events';
import { TableNonNumericalAlertRuleEdit } from '../table-non-numerical-alert-rule-edit';
import { TableObservations } from '../table-observations';

const dataTestIds = {
  ...dataTestIdsNumericalMetric,
  dataTab: 'metric-page-data-tab',
  dataTabPanel: 'metric-page-data-tab-panel',
};

export { dataTestIds as dataTestIdsNonNumericalMetric };

/**
 * View for a Non-Numerical Metric.
 *
 * This component shares the same props than <NumericalMetric /> (at least for now until this component is more fleshed out)
 *
 * This component renders a read-only graph showing counts of the Observations, and allows do read/edit Non-Numerical AlertRules.
 */
export const NonNumericalMetric: React.FC<NumericalMetric> = ({
  currentTab,
  metricApi,
  alertEvents,
  activeAlertEvents,
  startDateTime,
  endDateTime,
  isEditing,
  handleTabChange,
  onAlertRuleChange,
  onEdit,
}) => {
  const { metric, alertRules } = metricApi;

  const { getTabId } = useMetricTabs();
  const [timeGranularity, setTimeGranularity] = React.useState<TimeGranularity>(DEFAULT_TIME_GRANULARITY);
  const [valueAttribute, setValueAttribute] = React.useState<string>();
  const [dataInterpolation, setDataInterpolation] = useLocalStorageDataInterpolation({ id: metric.id });
  const {
    data: observations,
    isLoading,
    previousTimeGranularity,
    previousValueAttribute,
  } = useFetchNonNumericalObservations({
    metric,
    startDateTime,
    endDateTime,
    timeGranularity,
    valueAttribute,
  });

  return (
    <Box padding={2}>
      <MetricGraphNonNumerical
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        metric={metric}
        observations={observations}
        isEditing={isEditing}
        isLoading={isLoading}
        timeGranularity={timeGranularity}
        previousTimeGranularity={previousTimeGranularity}
        previousValueAttribute={previousValueAttribute}
        valueAttribute={valueAttribute}
        dataInterpolation={dataInterpolation}
        onTimeGranularityChange={setTimeGranularity}
        onValueAttributeChange={setValueAttribute}
        onDataInterpolationChange={setDataInterpolation}
        paddingBottom={2}
      />
      <Box padding={1} />
      <Card>
        <Box display="flex" justifyContent="space-between" paddingX={1}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            {metric?.alertRules.map(alertRule => (
              <Tab
                component="div"
                key={alertRule.id}
                data-testid={dataTestIds.alertRuleTab(alertRule)}
                value={getTabId(TabType.alertRule, alertRule.id)}
                label={
                  <TabLabelAlertRule metric={metric} alertRule={alertRule} onAlertRuleChange={onAlertRuleChange} />
                }
                wrapped
              />
            ))}
            <Tab data-testid={dataTestIds.dataTab} value={getTabId(TabType.data, 'all')} label="Data" wrapped />
            {!isEditing && metric?.alertRules?.length > 0 && (
              <Tab
                data-testid={dataTestIds.alertEventsTab}
                value={getTabId(TabType.alertEvents, 'all')}
                label={<TabLabelAlertEvents hasActiveAlertEvents={Boolean(activeAlertEvents.data?.data?.length > 0)} />}
                wrapped
              />
            )}
          </Tabs>
          <Show when={!isEditing}>
            <Box display="flex" alignItems="center">
              <ButtonCreateAlertRule metric={metric} onSuccess={onAlertRuleChange} />
            </Box>
          </Show>
        </Box>
        <Divider />
        {alertRules.map(alertRule => (
          <TabPanel
            key={alertRule.id}
            data-testid={dataTestIds.alertRuleTabPanel(alertRule)}
            value={currentTab}
            index={getTabId(TabType.alertRule, alertRule.id)}
          >
            {!isEditing ? (
              <>
                <InactiveChip alertRuleOrSchedule={alertRule} padding={1} />
                <TableNonNumericalAlertRuleReadOnly
                  metric={metric}
                  alertRule={alertRule}
                  onConfigure={() => onEdit(true)}
                  data-testid={dataTestIds.tableAlertRuleReadOnly(alertRule)}
                />
              </>
            ) : (
              <TableNonNumericalAlertRuleEdit
                alertRule={alertRule}
                onChange={updatedAlertRule => metricApi.updateAlertRule(updatedAlertRule)}
                data-testid={dataTestIds.tableAlertRuleEdit(alertRule)}
              />
            )}
          </TabPanel>
        ))}
        <TabPanel data-testid={dataTestIds.dataTabPanel} value={currentTab} index={getTabId(TabType.data, 'all')}>
          <TableObservations observations={observations} isLoading={isLoading} valueAttribute={valueAttribute} />
        </TabPanel>
        <Show when={metric?.alertRules?.length > 0}>
          <TabPanel
            data-testid={dataTestIds.alertEventsTabPanel}
            value={currentTab}
            index={getTabId(TabType.alertEvents, 'all')}
          >
            <TableAlertEvents
              alertEvents={alertEvents.data?.data}
              activeAlertEvents={activeAlertEvents.data?.data}
              isLoading={alertEvents.isValidating}
            />
          </TabPanel>
        </Show>
      </Card>
    </Box>
  );
};
