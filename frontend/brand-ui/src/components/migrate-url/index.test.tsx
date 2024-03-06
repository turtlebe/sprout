import { mockGlobalSnackbar, warningSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { MigrateUrl } from '.';

mockGlobalSnackbar();

describe('MigrateUrl', () => {
  const oldWindowLocation = window.location;
  let history;

  afterAll(() => {
    window.location = oldWindowLocation;
  });

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://farmos.plenty.tools/production/sites/LAX1/farms/LAX1/reports/machine-summary/machines?existing=parameters',
      },
      writable: true,
    });
    history = createMemoryHistory({ initialEntries: [window.location.href] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to the new URL with messaging', () => {
    // ACT
    render(
      <Router history={history}>
        <MigrateUrl to="/new-url" />
      </Router>
    );

    // ASSERT
    expect(warningSnackbar).toHaveBeenCalledWith(
      'You have been automatically forwarded to the new URL from the old deprecated URL "http://farmos.plenty.tools/production/sites/LAX1/farms/LAX1/reports/machine-summary/machines?existing=parameters". Please note to update any of your stored permalinks to this new URL.'
    );
    expect(history.location.pathname).toEqual('/new-url');
    expect(history.location.search).toEqual('?existing=parameters');
  });

  it('can redirect without transferring query parameters', () => {
    // ACT
    render(
      <Router history={history}>
        <MigrateUrl to="/new-url" withoutQueryParams />
      </Router>
    );

    // ASSERT
    expect(history.location.pathname).toEqual('/new-url');
    expect(history.location.search).toEqual('');
  });
});
