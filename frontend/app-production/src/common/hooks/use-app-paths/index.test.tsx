import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { useAppPaths } from './index';

describe('AppPathsProvider', () => {
  it('returns propers application paths using the given basePath', () => {
    const MockComponent: React.FC = () => {
      const paths = useAppPaths();
      const pathDivs = Object.keys(paths).map(path => (
        <div key={path} data-testid={path}>
          {paths[path]}
        </div>
      ));
      return <div data-testid="all-paths">{pathDivs}</div>;
    };

    const basePath = '/production/sites/LAX1/farms/LAX1';
    const qualityPath = '/quality/sites/LAX1/farms/LAX1';
    const { queryByTestId } = render(<MockComponent />, {
      wrapper: AppProductionTestWrapper,
    });

    expect(queryByTestId('all-paths').children.length).toBe(8);
    expect(queryByTestId('basePath')).toHaveTextContent(basePath);
    expect(queryByTestId('resourcesPageBasePath')).toHaveTextContent(`${basePath}/resources`);
    expect(queryByTestId('reactorsAndTasksBasePath')).toHaveTextContent(`${basePath}/reactors-and-tasks`);
    expect(queryByTestId('reactorsAndTasksDetailBasePath')).toHaveTextContent(`${basePath}/reactors-and-tasks/detail`);
    expect(queryByTestId('workspacesBasePath')).toHaveTextContent(`${basePath}/workspaces`);
    expect(queryByTestId('workcentersBasePath')).toHaveTextContent(`${basePath}/workcenters`);
    expect(queryByTestId('qualityBasePath')).toHaveTextContent(qualityPath);
    expect(queryByTestId('postharvestBasePath')).toHaveTextContent(`${qualityPath}/postharvest`);
  });
});
