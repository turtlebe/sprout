import {
  ButtonsSaveCancel,
  dataTestIdsButtonsSaveCancel,
  DropdownAlerts,
  HeaderMetric,
  NotFound,
} from '@plentyag/app-environment/src/common/components';
import { useMetricTabs, useWindowDateTime } from '@plentyag/app-environment/src/common/hooks';
import { isNumericalMetric } from '@plentyag/app-environment/src/common/utils';
import { AppLayout, WindowDateTimePicker } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule, Schedule, TabType } from '@plentyag/core/src/types/environment';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';

import { PATHS } from '../paths';

import {
  dataTestIdsDropdownMetricActions,
  DropdownMetricActions,
  NonNumericalMetric,
  NumericalMetric,
} from './components';
import { useFetchAlertEvents, useMetricApi } from './hooks';

const dataTestIds = {
  loader: 'metric-page-content-loader',
  dropdown: dataTestIdsDropdownMetricActions,
  windowDateTimePicker: 'metric-page-window-date-time-picker',
  alertRuleTab: (alertRule: AlertRule) => `metric-page-alert-rule-tab-${alertRule.id}`,
  scheduleTab: (schedule: Schedule) => `metric-page-schedule-tab-${schedule.id}`,
  alertRuleTabPanel: (alertRule: AlertRule) => `metric-page-alert-rule-tab-panel-${alertRule.id}`,
  scheduleTabPanel: (schedule: Schedule) => `metric-page-schedule-tab-panel-${schedule.id}`,
  tableAlertRuleReadOnly: (alertRule: AlertRule) => `metric-page-table-alert-rule-read-only-${alertRule.id}`,
  tableAlertRuleEdit: (alertRule: AlertRule) => `metric-page-table-alert-rule-edit-${alertRule.id}`,
  alertEventsTabPanel: 'metric-page-tab-panel-alert-events',
  ...dataTestIdsButtonsSaveCancel,
};

export { dataTestIds as dataTestIdsMetricPage };

export interface MetricPageUrlParams {
  metricId: string;
  tabType?: string;
  tabId?: string;
}

/**
 * MetricPage shows information about the metric such as path, measurement type and observation name and
 * displays alert rules, schedules and observations related to this Metric.
 *
 * {@link MetricGraph} render the alert rules, schedules and the observations in a D3 graph.
 * Users can also see this information in a tabular fashion through {@link TableAlertRuleReadOnly} and {@link TableScheduleReadOnly}.
 *
 * This component renders one sub component or another depending if the Metric is numerical or not.
 */
export const MetricPage: React.FC<RouteComponentProps<MetricPageUrlParams>> = ({ match }) => {
  const { metricId, tabType, tabId } = match.params;

  const history = useHistory();
  const { currentTab, parseTabValue, setTab } = useMetricTabs();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const { startDateTime, endDateTime, setStartDateTime, setEndDateTime } = useWindowDateTime();

  // Requests
  const metricApi = useMetricApi({ metricId });
  const { metric, scheduleAndDefinition } = metricApi;
  const { schedule, scheduleDefinition } = scheduleAndDefinition;

  const alertEvents = useFetchAlertEvents({
    metric,
    startDateTime,
    endDateTime,
  });

  const activeAlertEvents = useFetchAlertEvents({
    metric,
    active: true,
  });

  const isLoading = metricApi.request.isValidating;
  const isUpdating = metricApi.isUpdating;

  // handlers
  function handleTabChange(_, value: any) {
    const { type, id } = parseTabValue(value);
    history.push(`${PATHS.metricPageTab(metricId, type, id)}${history.location.search}`);
    setTab(type, id);
  }

  function handleWindowChanged(startDateTime, endDateTime) {
    setStartDateTime(startDateTime);
    setEndDateTime(endDateTime);
  }

  function handleEditAlertRule() {
    if (!currentTab.includes(TabType.alertRule)) {
      const alertRuleId = metric.alertRules[0].id;
      history.push(`${PATHS.metricPageTab(metricId, TabType.alertRule, alertRuleId)}${history.location.search}`);
      setTab(TabType.alertRule, alertRuleId);
    }

    setIsEditing(true);
  }

  function handleCancelEdit() {
    metricApi.resetAlertRules();
    setIsEditing(false);
  }

  function handleApplyEdit() {
    metricApi.persistAlertRules({ onSuccess: () => setIsEditing(false) });
  }

  function handleAlertRuleChange() {
    void metricApi.request.revalidate();
  }

  function handleChangeAlertRules(newAlertRules: AlertRule[]) {
    metricApi.updateAndPersistAlertRules(newAlertRules, { onSuccess: async () => metricApi.request.revalidate() });
  }

  React.useEffect(() => {
    if (currentTab || isLoading) {
      return;
    }

    if (tabType === TabType.data) {
      history.push(`${PATHS.metricPageTab(metricId, TabType.data, 'all')}${history.location.search}`);
      setTab(TabType.data, 'all');
    }

    if (metric && !isNumericalMetric(metric) && metric.alertRules.length === 0) {
      history.push(`${PATHS.metricPageTab(metricId, TabType.data, 'all')}${history.location.search}`);
      setTab(TabType.data, 'all');
    }

    if (metric?.alertRules.length > 0 && tabType === TabType.alertEvents) {
      history.push(`${PATHS.metricPageTab(metricId, TabType.alertEvents, 'all')}${history.location.search}`);
      setTab(TabType.alertEvents, 'all');
    }

    if (metric?.alertRules.length > 0 && (!tabType || tabType === TabType.alertRule)) {
      const alertRuleId = metric?.alertRules.find(alertRule => alertRule.id === tabId)?.id || metric?.alertRules[0].id;

      history.push(`${PATHS.metricPageTab(metricId, TabType.alertRule, alertRuleId)}${history.location.search}`);
      setTab(TabType.alertRule, alertRuleId);
    } else if (schedule && scheduleDefinition && (!tabType || tabType === TabType.schedule)) {
      const scheduleId = metricApi.scheduleAndDefinition.schedule.id;

      history.push(`${PATHS.metricPageTab(metricId, TabType.schedule, scheduleId)}${history.location.search}`);
      setTab(TabType.schedule, scheduleId);
    }
  }, [metric, schedule, scheduleDefinition, currentTab, tabType, metricId, isLoading]);

  React.useEffect(() => {
    if (!currentTab || !metric) {
      return;
    }

    const { type, id } = parseTabValue(currentTab);

    if (type !== TabType.alertRule) {
      return;
    }

    // An alertRule has been deleted and the ID of the current tab no longer exists.
    // We need to change the tab and update the URL.
    if (!metric.alertRules.find(alertRule => alertRule.id === id)) {
      if (metric.alertRules.length === 0) {
        history.push(`${PATHS.metricPage(metricId)}${history.location.search}`);
        setTab(undefined, undefined);
      } else {
        const alertRule = metric.alertRules[0];
        history.push(`${PATHS.metricPageTab(metricId, TabType.alertRule, alertRule.id)}${history.location.search}`);
        setTab(TabType.alertRule, alertRule.id);
      }
    }
  }, [metric, currentTab]);

  if (metricApi.request.error?.response?.status === 404) {
    return <NotFound title="This Metric doesn't exist." />;
  }

  return (
    <AppLayout isLoading={isLoading || isUpdating}>
      <HeaderMetric metric={metric} isLoading={isLoading}>
        {!isEditing ? (
          <Box display="flex" justifyContent="space-between">
            <WindowDateTimePicker
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              onChange={handleWindowChanged}
              data-testid={dataTestIds.windowDateTimePicker}
            />
            <Box display="flex" alignItems="center">
              <DropdownAlerts alertRules={metric?.alertRules} onAlertRuleChanges={handleChangeAlertRules} />

              <DropdownMetricActions
                metric={metric}
                tabType={tabType as TabType}
                tabId={tabId}
                onMetricUpdated={handleAlertRuleChange}
                onEditAlertRule={handleEditAlertRule}
              />
            </Box>
          </Box>
        ) : (
          <ButtonsSaveCancel onCancel={handleCancelEdit} onSave={handleApplyEdit} />
        )}
      </HeaderMetric>

      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size="2rem" data-testid={dataTestIds.loader} />
        </Box>
      ) : isNumericalMetric(metric) ? (
        <NumericalMetric
          metricApi={metricApi}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          alertEvents={alertEvents}
          activeAlertEvents={activeAlertEvents}
          isEditing={isEditing}
          currentTab={currentTab}
          handleTabChange={handleTabChange}
          onAlertRuleChange={handleAlertRuleChange}
          onEdit={setIsEditing}
        />
      ) : (
        <NonNumericalMetric
          metricApi={metricApi}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          alertEvents={alertEvents}
          activeAlertEvents={activeAlertEvents}
          isEditing={isEditing}
          currentTab={currentTab}
          handleTabChange={handleTabChange}
          onAlertRuleChange={handleAlertRuleChange}
          onEdit={setIsEditing}
        />
      )}
    </AppLayout>
  );
};
