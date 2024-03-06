import {
  ButtonCreateAlertRule,
  InactiveChip,
  LinkSchedule,
  TabLabelAlertEvents,
  TabLabelAlertRule,
  TabLabelSchedule,
  TableAlertRuleReadOnly,
  TableScheduleReadOnly,
} from '@plentyag/app-environment/src/common/components';
import {
  useFetchAndConvertObservations,
  useLocalStorageTimeGranularity,
  useMetricTabs,
} from '@plentyag/app-environment/src/common/hooks';
import { hasAllAlertRules } from '@plentyag/app-environment/src/common/utils';
import { COLORS } from '@plentyag/app-environment/src/common/utils/constants';
import { Show, TabPanel } from '@plentyag/brand-ui/src/components';
import { Box, Card, Divider, Tab, Tabs } from '@plentyag/brand-ui/src/material-ui/core';
import { UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { AlertEvent, AlertRule, Schedule, TabType } from '@plentyag/core/src/types/environment';
import React from 'react';

import { UseMetricApiReturn } from '../../hooks';
import { getBufferedStartDateTime } from '../../utils';
import { EmptyPlaceholder } from '../empty-placeholder';
import { MetricGraph } from '../metric-graph';
import { TableAlertEvents } from '../table-alert-events';
import { TableAlertRuleEdit } from '../table-alert-rule-edit';

const dataTestIds = {
  alertRuleTab: (alertRule: AlertRule) => `metric-page-alert-rule-tab-${alertRule.id}`,
  scheduleTab: (schedule: Schedule) => `metric-page-schedule-tab-${schedule.id}`,
  alertRuleTabPanel: (alertRule: AlertRule) => `metric-page-alert-rule-tab-panel-${alertRule.id}`,
  scheduleTabPanel: (schedule: Schedule) => `metric-page-schedule-tab-panel-${schedule.id}`,
  tableAlertRuleReadOnly: (alertRule: AlertRule) => `metric-page-table-alert-rule-read-only-${alertRule.id}`,
  tableAlertRuleEdit: (alertRule: AlertRule) => `metric-page-table-alert-rule-edit-${alertRule.id}`,
  alertEventsTabPanel: 'metric-page-tab-panel-alert-events',
  alertEventsTab: 'metric-page-alert-events-tab',
};

export { dataTestIds as dataTestIdsNumericalMetric };

export interface NumericalMetric {
  startDateTime: Date;
  endDateTime: Date;
  metricApi: UseMetricApiReturn;
  alertEvents: UseSwrAxiosReturn<PaginatedList<AlertEvent>>;
  activeAlertEvents: UseSwrAxiosReturn<PaginatedList<AlertEvent>>;
  isEditing: boolean;
  currentTab: string;
  handleTabChange: (_: any, value: any) => void;
  onAlertRuleChange: TabLabelAlertRule['onAlertRuleChange'];
  onEdit: (isEditing: boolean) => void;
}

/**
 * View for a Numerical Metric. This component renders an interactive graph with AlertRules, Schedules and AlertEvents.
 */
export const NumericalMetric: React.FC<NumericalMetric> = ({
  startDateTime,
  endDateTime,
  metricApi,
  alertEvents,
  activeAlertEvents,
  isEditing,
  currentTab,
  handleTabChange,
  onAlertRuleChange,
  onEdit,
}) => {
  const { metric, scheduleAndDefinition, alertRules } = metricApi;
  const { schedule, scheduleDefinition } = scheduleAndDefinition;
  const { getTabId } = useMetricTabs();

  const bufferedStartDateTime = React.useMemo(
    () => getBufferedStartDateTime(metric, startDateTime),
    [metric, startDateTime]
  );
  const [timeGranularity, setTimeGranularity] = useLocalStorageTimeGranularity({ startDateTime, endDateTime });
  const observations = useFetchAndConvertObservations({
    metric,
    startDateTime: bufferedStartDateTime,
    endDateTime,
    timeGranularity,
    includeNoData: true,
  });

  return currentTab ? (
    <Box padding={2}>
      <MetricGraph
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={timeGranularity}
        schedule={schedule}
        scheduleDefinition={scheduleDefinition}
        alertRules={alertRules}
        alertEvents={alertEvents.data?.data}
        observationsRequest={observations}
        metric={metric}
        isEditing={isEditing}
        currentTab={currentTab}
        onTimeGranularityChange={setTimeGranularity}
        onChange={updatedAlertRule => metricApi.updateAlertRule(updatedAlertRule)}
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
                wrapped
                label={
                  <TabLabelAlertRule
                    metric={metric}
                    alertRule={alertRule}
                    onAlertRuleChange={onAlertRuleChange}
                    readOnly={isEditing}
                  />
                }
              />
            ))}
            {!isEditing && schedule && scheduleDefinition && (
              <Tab
                key={schedule.id}
                data-testid={dataTestIds.scheduleTab(schedule)}
                value={getTabId(TabType.schedule, schedule.id)}
                wrapped
                label={<TabLabelSchedule scheduleDefinition={scheduleDefinition} />}
              />
            )}
            {!isEditing && metric?.alertRules?.length > 0 && (
              <Tab
                data-testid={dataTestIds.alertEventsTab}
                value={getTabId(TabType.alertEvents, 'all')}
                label={<TabLabelAlertEvents hasActiveAlertEvents={Boolean(activeAlertEvents.data?.data?.length > 0)} />}
                wrapped
              />
            )}
          </Tabs>
          <Show when={!isEditing && !hasAllAlertRules(metric)}>
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
                <TableAlertRuleReadOnly
                  metric={metric}
                  alertRule={alertRule}
                  onConfigure={() => onEdit(true)}
                  data-testid={dataTestIds.tableAlertRuleReadOnly(alertRule)}
                />
              </>
            ) : (
              <TableAlertRuleEdit
                metric={metric}
                alertRule={alertRule}
                onChange={updatedAlertRule => metricApi.updateAlertRule(updatedAlertRule)}
                data-testid={dataTestIds.tableAlertRuleEdit(alertRule)}
              />
            )}
          </TabPanel>
        ))}
        {schedule && scheduleDefinition && (
          <TabPanel
            key={schedule.id}
            data-testid={dataTestIds.scheduleTabPanel(schedule)}
            value={currentTab}
            index={getTabId(TabType.schedule, schedule.id)}
          >
            <LinkSchedule schedule={schedule} color={COLORS.schedule} />
            <TableScheduleReadOnly schedule={schedule} scheduleDefinition={scheduleDefinition} />
          </TabPanel>
        )}
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
  ) : (
    <>
      <Box padding={2}>
        <MetricGraph
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          timeGranularity={timeGranularity}
          observationsRequest={observations}
          metric={metric}
          onTimeGranularityChange={setTimeGranularity}
          onChange={updatedAlertRule => metricApi.updateAlertRule(updatedAlertRule)}
        />
      </Box>
      <EmptyPlaceholder metric={metric} onAlertRuleCreated={onAlertRuleChange} />
    </>
  );
};
