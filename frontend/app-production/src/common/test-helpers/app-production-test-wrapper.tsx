import { AppPathsProvider } from '@plentyag/app-production/src/common/hooks/use-app-paths';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

const dataTestIds = getScopedDataTestIds({}, 'testWrapper');

export { dataTestIds as dataTestIdsTestWrapper };

export interface AppProductionWrapper {
  basePath?: string;
  history?: MemoryHistory;
}

// test base path
export const mockBasePath = '/production/sites/LAX1/farms/LAX1';

/**
 * Wrapper that provides react context for unit tests.
 * Also, MemoryRouter is provided so navigation links can be tested.
 */
export const AppProductionTestWrapper: React.FC<AppProductionWrapper> = ({
  children,
  basePath = mockBasePath,
  history,
}) => {
  return (
    <Router history={history || createMemoryHistory()}>
      <AppPathsProvider basePath={basePath}>{children}</AppPathsProvider>
    </Router>
  );
};
