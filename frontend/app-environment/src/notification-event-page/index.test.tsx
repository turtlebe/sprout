import { useSwrAxios } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { mockNotificationEvents } from '../common/test-helpers';
import { EVS_URLS } from '../common/utils';
import { PATHS } from '../paths';

import { dataTestIdsNotificationEventPage, NotificationEventPage } from '.';

import { GroupedAlertEventsTable } from './components';
import { useLoadAlertEvents } from './hooks';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/app-environment/src/notification-event-page/hooks/use-load-alert-events');
jest.mock('@plentyag/app-environment/src/notification-event-page/components/grouped-alert-events-table');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseLoadAlertEvents = useLoadAlertEvents as jest.Mock;
const MockGroupedAlertEventsTable = GroupedAlertEventsTable as jest.Mock;
const dataTestIds = {
  ...dataTestIdsNotificationEventPage,
  groupedAlertEventsTable: 'groupedAlertEventsTable',
};
const notificationEventId = '1234';

function renderNotificationEventPage() {
  const history = createMemoryHistory({ initialEntries: [PATHS.notificationDetailPage(notificationEventId)] });

  return render(
    <Router history={history}>
      <Route path={PATHS.notificationDetailPage(':notificationEventId')} component={NotificationEventPage} />
    </Router>
  );
}

describe('NotificationEventPage', () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    MockGroupedAlertEventsTable.mockImplementation(() => <div data-testid={dataTestIds.groupedAlertEventsTable} />);
  });

  it('renders with a 404 page', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined, error: { response: { status: 404 } } });
    mockUseLoadAlertEvents.mockReturnValue({ isLoading: false, alertEvents: undefined });

    const { queryByTestId } = renderNotificationEventPage();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.generatedAt)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.status)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.groupedAlertEventsTable)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.notFound)).toBeInTheDocument();
  });

  it('renders with a loader when loading the NotificationEvent', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: true, data: undefined });
    mockUseLoadAlertEvents.mockReturnValue({ isLoading: false, alertEvents: undefined });

    const { queryByTestId } = renderNotificationEventPage();

    expect(queryByTestId(dataTestIds.notFound)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.generatedAt)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.status)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.groupedAlertEventsTable)).not.toBeInTheDocument();
  });

  it('renders with a loader when loading the AlertEvents', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockNotificationEvents[0] });
    mockUseLoadAlertEvents.mockReturnValue({ isLoading: true, alertEvents: undefined });

    const { queryByTestId } = renderNotificationEventPage();

    expect(queryByTestId(dataTestIds.notFound)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.generatedAt)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.status)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.groupedAlertEventsTable)).not.toBeInTheDocument();
  });

  it('renders with the notification details', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockNotificationEvents[0] });
    mockUseLoadAlertEvents.mockReturnValue({ isLoading: false, alertEvents: [] });

    const { queryByTestId } = renderNotificationEventPage();

    expect(queryByTestId(dataTestIds.notFound)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.generatedAt)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.status)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.groupedAlertEventsTable)).toBeInTheDocument();

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: EVS_URLS.notificationEvents.getByIdUrl(notificationEventId),
    });
  });
});
