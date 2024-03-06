import { useUnpaginate } from '@plentyag/core/src/hooks';
import { AlertEvent } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface UseLoadAlertEvents {
  notificationEventId: string;
}

export interface UseLoadAlertEventsReturn {
  alertEvents: AlertEvent[];
  isLoading: boolean;
}

export const useLoadAlertEvents = ({ notificationEventId }: UseLoadAlertEvents): UseLoadAlertEventsReturn => {
  const [alertEvents, setAlertEvents] = React.useState<AlertEvent[]>();
  const { makeRequest, isLoading } = useUnpaginate<AlertEvent[]>({
    serviceName: 'environment-service',
    apiName: 'alert-events-api',
    operation: 'search-alert-events',
  });

  React.useEffect(() => {
    makeRequest({
      data: { notificationEventIds: [notificationEventId], includeMetric: true, includeAlertRule: true },
      onSuccess: response => {
        setAlertEvents(response);
      },
    });
  }, [notificationEventId]);

  return {
    alertEvents,
    isLoading,
  };
};
