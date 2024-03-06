import { Check, Clear } from '@material-ui/icons';
import {
  LinkMetric,
  NotFound,
  ScheduleGraph,
  TabLabelSchedule,
  TableScheduleReadOnly,
} from '@plentyag/app-environment/src/common/components';
import {
  useLocalStorageTimeGranularity,
  useRelatedMetricsAndObservations,
  useWindowDateTime,
} from '@plentyag/app-environment/src/common/hooks';
import { getColorGenerator, isSingleValueScheduleDefinition } from '@plentyag/app-environment/src/common/utils';
import { AppLayout, Show, TabPanel, WindowDateTimePicker } from '@plentyag/brand-ui/src/components';
import { Box, Button, Card, CircularProgress, Divider, Tab, Tabs } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import {
  DropdownScheduleActions,
  EmptyPlaceholder,
  HeaderSchedule,
  TableScheduleEdit,
  TabMetricsLabel,
} from './components';
import { useScheduleApi } from './hooks';

const dataTestIds = {
  cancel: 'schedule-page-cancel-editing',
  save: 'schedule-page-save',
  loader: 'schedule-page-loader',
  windowDateTimePicker: 'schedule-page-window-date-time-picker',
};

export { dataTestIds as dataTestIdsSchedulePage };

export interface SchedulePageUrlParams {
  scheduleId: string;
}

/**
 * Page to view/edit a Schedule.
 */
export const SchedulePage: React.FC<RouteComponentProps<SchedulePageUrlParams>> = ({ match }) => {
  const { scheduleId } = match.params;

  const scheduleApi = useScheduleApi({ scheduleId });
  const { schedule, scheduleDefinition, isLoading, isUpdating } = scheduleApi;
  const { startDateTime, endDateTime, setStartDateTime, setEndDateTime } = useWindowDateTime();
  const [currentTab, setCurrentTab] = React.useState('schedule');
  const colorGenerator = getColorGenerator();

  const [timeGranularity, setTimeGranularity] = useLocalStorageTimeGranularity({ startDateTime, endDateTime });
  const relatedMetricsAndObservationsApi = useRelatedMetricsAndObservations({
    scheduleDefinition,
    startDateTime,
    endDateTime,
    timeGranularity,
  });
  const { data: metricsWithObservations = [], isValidating: isRelatedMetricsLoading } =
    relatedMetricsAndObservationsApi;

  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  function handleWindowChanged(startDateTime, endDateTime) {
    setStartDateTime(startDateTime);
    setEndDateTime(endDateTime);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    scheduleApi.resetSchedule();
  }

  function handleApplyEdit() {
    setIsEditing(false);
    scheduleApi.persistSchedule({});
  }

  const isScheduleBroken = React.useMemo(
    () =>
      scheduleDefinition &&
      schedule &&
      !isSingleValueScheduleDefinition(scheduleDefinition) &&
      schedule?.actions?.some(action => action.valueType === 'SINGLE_VALUE'),
    [schedule, scheduleDefinition]
  );

  if (isScheduleBroken) {
    return (
      <NotFound title="This Schedule is not configured correctly. It has single value actions while its definition requires mutliple values. Please contact #farmos-support." />
    );
  }

  if (scheduleApi.scheduleRequest.error?.response?.status === 404) {
    return <NotFound title="This Schedule doesn't exist." />;
  }

  return (
    <AppLayout isLoading={isLoading || isUpdating}>
      <HeaderSchedule isLoading={isLoading} schedule={schedule}>
        {!isEditing ? (
          <Box display="flex" justifyContent="space-between">
            <WindowDateTimePicker
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              onChange={handleWindowChanged}
              data-testid={dataTestIds.windowDateTimePicker}
            />
            <DropdownScheduleActions
              schedule={schedule}
              scheduleDefinition={scheduleDefinition}
              onEditActions={() => setIsEditing(true)}
              onScheduleUpdated={scheduleApi.revalidateSchedule}
            />
          </Box>
        ) : (
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Clear />}
              onClick={handleCancelEdit}
              data-testid={dataTestIds.cancel}
            >
              Cancel
            </Button>
            <Box padding={1} />
            <Button variant="contained" startIcon={<Check />} onClick={handleApplyEdit} data-testid={dataTestIds.save}>
              Save
            </Button>
          </Box>
        )}
      </HeaderSchedule>
      {isLoading && (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size="2rem" data-testid={dataTestIds.loader} />
        </Box>
      )}
      {!isLoading && !isEditing && schedule?.actions?.length === 0 && (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <EmptyPlaceholder onAddAction={() => setIsEditing(true)} />
        </Box>
      )}

      {!isLoading && !isEditing && schedule?.actions?.length > 0 && (
        <Box padding={2}>
          <ScheduleGraph
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            timeGranularity={timeGranularity}
            schedule={schedule}
            scheduleDefinition={scheduleDefinition}
            relatedMetricsAndObservationsApi={relatedMetricsAndObservationsApi}
            isEditing={isEditing}
            onTimeGranularityChange={setTimeGranularity}
            paddingBottom={2}
          />
          <Box padding={1} />
          <Card>
            <Tabs value={currentTab} onChange={(_, tab) => setCurrentTab(tab)}>
              <Tab label={<TabLabelSchedule scheduleDefinition={scheduleDefinition} />} wrapped value="schedule" />
              <Tab label={<TabMetricsLabel isLoading={isRelatedMetricsLoading} />} value="metrics" />
            </Tabs>
            <Divider />
            <TabPanel value={currentTab} index="schedule">
              <TableScheduleReadOnly schedule={schedule} scheduleDefinition={scheduleDefinition} />
            </TabPanel>
            <TabPanel value={currentTab} index="metrics">
              <Box padding={2}>
                {metricsWithObservations.map(metricWithObservations => (
                  <LinkMetric
                    key={metricWithObservations.metric.id}
                    metric={metricWithObservations.metric}
                    color={colorGenerator.next().value[0]}
                  />
                ))}
                <Show when={!isRelatedMetricsLoading && metricsWithObservations.length == 0}>
                  No Metrics are associated to this Schedule.
                </Show>
              </Box>
            </TabPanel>
          </Card>
        </Box>
      )}

      {!isLoading && isEditing && (
        <Box padding={2}>
          <ScheduleGraph
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            timeGranularity={timeGranularity}
            schedule={schedule}
            scheduleDefinition={scheduleDefinition}
            isEditing={isEditing}
            onTimeGranularityChange={setTimeGranularity}
            onChange={scheduleApi.updateSchedule}
            paddingBottom={2}
          />
          <Box padding={1} />
          <Card>
            <TableScheduleEdit
              schedule={schedule}
              scheduleDefinition={scheduleDefinition}
              onChange={scheduleApi.updateSchedule}
            />
          </Card>
        </Box>
      )}
    </AppLayout>
  );
};
