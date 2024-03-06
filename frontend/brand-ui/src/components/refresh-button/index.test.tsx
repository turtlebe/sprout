import { render, waitFor } from '@testing-library/react';
import { Settings } from 'luxon';
import React from 'react';

import { dataTestids, RefreshButton } from '.';

describe('ReportRefreshButton', () => {
  const mockNow = new Date('2020-02-01');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    jest.useRealTimers();
    Settings.defaultZone = 'system';
  });

  it('renders a loading state', () => {
    const { getByTestId } = render(<RefreshButton lastRefreshedAt={null} onClick={jest.fn()} />);

    expect(getByTestId(dataTestids.loader)).toBeVisible();
  });

  it('renders a button and a relative time', async () => {
    const handleClick = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <RefreshButton lastRefreshedAt={'2020-01-01T00:00:00'} onClick={handleClick} delay={0} />
    );

    await waitFor(() => expect(queryByTestId(dataTestids.loader)).not.toBeInTheDocument());

    expect(getByTestId(dataTestids.button)).toBeVisible();
    expect(getByTestId(dataTestids.lastRefreshedAt)).toHaveTextContent('Last Refresh: 30 days ago');

    getByTestId(dataTestids.button).click();
    expect(handleClick).toHaveBeenCalled();
  });
});
