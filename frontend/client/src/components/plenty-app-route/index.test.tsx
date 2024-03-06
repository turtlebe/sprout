import { lazyWithRetry } from '@plentyag/core/src/utils/lazy-with-retry';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';

import { PlentyAppRoute } from '.';

jest.mock('@plentyag/core/src/utils/lazy-with-retry');
const mockLazyWithRetry = lazyWithRetry as jest.Mock;

describe('PlentyAppRoute', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderPlentyAppRoute() {
    const history = createMemoryHistory({ initialEntries: ['/'] });

    const renderResult = render(
      <Router history={history}>
        <PlentyAppRoute path="/production" name="production" />
        <PlentyAppRoute path="/quality" name="quality" />
      </Router>
    );

    return { history, ...renderResult };
  }

  it('loads routes and uses cached components', () => {
    const mockProductionAppDataTestId = 'mock-production-app-data-test-id';
    const mockProductionApp = function () {
      return <div data-testid={mockProductionAppDataTestId}>production app</div>;
    };
    const mockQualityAppDataTestId = 'mock-quality-app-data-test-id';
    const mockQualityApp = function () {
      return <div data-testid={mockQualityAppDataTestId}>quality app</div>;
    };

    mockLazyWithRetry.mockReturnValueOnce(mockProductionApp).mockReturnValueOnce(mockQualityApp);

    const { queryByTestId, history } = renderPlentyAppRoute();

    expect(mockLazyWithRetry).toHaveBeenCalledTimes(2);
    mockLazyWithRetry.mockClear();

    // no components rendered, since path doesn't match any routes.
    history.push('/unknown');
    expect(queryByTestId(mockProductionAppDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockQualityAppDataTestId)).not.toBeInTheDocument();

    history.push('/production');
    expect(queryByTestId(mockProductionAppDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockQualityAppDataTestId)).not.toBeInTheDocument();

    history.push('/quality');
    expect(queryByTestId(mockProductionAppDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockQualityAppDataTestId)).toBeInTheDocument();

    // call production again, uses cache, so mockLazyWithRetry isn't call again.
    history.push('/production');
    expect(queryByTestId(mockProductionAppDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockQualityAppDataTestId)).not.toBeInTheDocument();

    // not called anymore since initial, because components have been cached.
    expect(mockLazyWithRetry).toHaveBeenCalledTimes(0);
  });
});
