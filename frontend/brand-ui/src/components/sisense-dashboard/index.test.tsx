import { IframePure } from '@plentyag/brand-ui/src/components/iframe';
import { MockIframeLoaded, MockIframeLoading } from '@plentyag/brand-ui/src/components/iframe/test-helpers';
import { SECONDS_AGO_TEXT } from '@plentyag/core/src/utils';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { DateTime } from 'luxon';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';

import { dataTestIdsSisenseDashboard as dataTestIds, SisenseDashboard } from '.';

import { useGetReport, useUpdateCache } from './hooks';

jest.mock('@plentyag/brand-ui/src/components/iframe');
jest.mock('./hooks/use-get-report');
jest.mock('./hooks/use-update-cache');

const mockUseGetReport = useGetReport as jest.Mock;
const mockUseUpdateCache = useUpdateCache as jest.Mock;
const MockIframe = IframePure as jest.Mock;

export function getMatch(dashboardName: string) {
  return {
    isExact: true,
    params: {
      dashboardName,
    },
    path: '/quality/:dashboardName/report',
    url: `/quality/${dashboardName}/report`,
  };
}

describe('SeedlingQaReport', () => {
  it('redirect to / when backend returns 404', () => {
    const history = createMemoryHistory({ initialEntries: [getMatch('not-found').url] });
    mockUseGetReport.mockReturnValue({ error: { response: { status: 404 } } });
    mockUseUpdateCache.mockReturnValue({ makeRequest: jest.fn() });

    render(
      <Router history={history}>
        <SisenseDashboard match={getMatch('not-found')} />
      </Router>
    );

    expect(history.location.pathname).toBe('/');
  });

  it('shows a loading state', () => {
    MockIframe.mockImplementation(MockIframeLoading);
    mockUseGetReport.mockReturnValue({ isValidating: true });
    mockUseUpdateCache.mockReturnValue({ makeRequest: jest.fn() });

    const { queryByTestId } = render(
      <MemoryRouter initialEntries={[getMatch('seedling').url]}>
        <SisenseDashboard match={getMatch('seedling')} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.loader)).toBeVisible();
    expect(queryByTestId(dataTestIds.iframe)).toBeInTheDocument();
  });

  it('updates the cache when clicking refresh', async () => {
    MockIframe.mockImplementation(MockIframeLoaded);
    mockUseGetReport.mockReturnValue({
      data: {
        url: 'http://mock-url.com',
        lastRefreshedAt: DateTime.now().minus({ months: 1 }).toISO(),
      },
      isValidating: false,
    });
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => {
      onSuccess({ lastRefreshedAt: DateTime.now().toISO() });
    });
    mockUseUpdateCache.mockReturnValue({ makeRequest });

    const { queryByTestId } = render(
      <MemoryRouter initialEntries={[getMatch('seedling').url]}>
        <SisenseDashboard match={getMatch('seedling')} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeVisible();
    expect(queryByTestId(dataTestIds.iframe)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.iframe)).toHaveAttribute('data-testsrc', 'http://mock-url.com');

    await waitFor(() => expect(queryByTestId(dataTestIds.refreshButton.loader)).not.toBeInTheDocument());
    expect(queryByTestId(dataTestIds.refreshButton.lastRefreshedAt)).toHaveTextContent('Last Refresh: 1 month ago');
    queryByTestId(dataTestIds.refreshButton.button).click();
    expect(makeRequest).toHaveBeenCalled();
    await waitFor(() =>
      expect(queryByTestId(dataTestIds.refreshButton.lastRefreshedAt)).toHaveTextContent(
        `Last Refresh: ${SECONDS_AGO_TEXT}`
      )
    );
  });
});
