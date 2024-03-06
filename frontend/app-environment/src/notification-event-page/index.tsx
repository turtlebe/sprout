import { NotFound } from '@plentyag/app-environment/src/common/components';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import {
  AppBreadcrumbs,
  AppHeader,
  AppLayout,
  CircularProgressCentered,
  Show,
} from '@plentyag/brand-ui/src/components';
import { Box, Button, Chip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { NotificationEvent, TabType } from '@plentyag/core/src/types/environment';
import moment from 'moment';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';

import { PATHS } from '../paths';

import { GroupedAlertEventsTable } from './components';
import { useLoadAlertEvents } from './hooks';

const dataTestIds = {
  generatedAt: 'notification-event-page-generated-at',
  status: 'notification-event-page-status',
  loader: 'notification-event-page-loader',
  notFound: 'notification-event-page-not-found',
};

export { dataTestIds as dataTestIdsNotificationEventPage };

export interface NotificationEventPageUrlParams {
  notificationEventId: string;
}

export const NotificationEventPage: React.FC<RouteComponentProps<NotificationEventPageUrlParams>> = ({ match }) => {
  const { notificationEventId } = match.params;
  const history = useHistory();

  const requests = {
    notificationEvent: useSwrAxios<NotificationEvent>({
      url: EVS_URLS.notificationEvents.getByIdUrl(notificationEventId),
    }),
    alertEvents: useLoadAlertEvents({ notificationEventId }),
  };
  const { data, isValidating: isLoadingNotificationEvent, error } = requests.notificationEvent;
  const { alertEvents, isLoading: isLoadingAlertEvents } = requests.alertEvents;

  if (error?.response?.status === 404) {
    return <NotFound data-testid={dataTestIds.notFound} title="This Notification doesn't exist." />;
  }

  const isLoading = isLoadingNotificationEvent || isLoadingAlertEvents;

  return (
    <AppLayout isLoading={isLoading}>
      <AppHeader>
        <AppBreadcrumbs
          homePageRoute={data?.metricId ? PATHS.metricPage(data.metricId) : undefined}
          homePageName={'Metric'}
          pageName={isLoading ? '--' : `Notification: ${data?.id}`}
          marginLeft="0.75rem"
        />
        {data && (
          <Box display="flex" alignItems="center">
            <Chip color="primary" label={`Status: ${data.status}`} data-testid={dataTestIds.status} />
            <Box padding={1} />
            <Typography data-testid={dataTestIds.generatedAt}>
              Notification sent at: {moment(data.generatedAt).format('MM/DD/YYYY hh:mm A')}
            </Typography>
            <Box padding={1} />
            <Button
              variant="contained"
              color="default"
              onClick={() => history.push(PATHS.metricPageTab(data.metricId, TabType.alertRule, data.alertRuleId))}
            >
              See Alert Rule
            </Button>
            <Box padding={1} />
            <Button
              variant="contained"
              color="default"
              onClick={() =>
                history.push(PATHS.subscriptionsPageTab(data.metricId, TabType.alertRule, data.alertRuleId))
              }
            >
              See Subscription
            </Button>
          </Box>
        )}
      </AppHeader>

      <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loader} />}>
        <GroupedAlertEventsTable alertEvents={alertEvents} />
      </Show>
    </AppLayout>
  );
};
