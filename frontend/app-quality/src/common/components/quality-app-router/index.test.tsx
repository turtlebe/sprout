import { GlobalSelectFarm } from '@plentyag/brand-ui/src/components/global-select-farm';
import { SideNavTreeNode } from '@plentyag/brand-ui/src/components/side-nav-layout';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { QualityAppRouter } from '.';

jest.mock('@plentyag/brand-ui/src/components/global-select-farm');
const mockGlobalSelectFarmDataTestId = 'mock-global-select';
(GlobalSelectFarm as jest.Mock).mockImplementation(() => {
  return <div data-testid={mockGlobalSelectFarmDataTestId}>mock global select</div>;
});

const mockFormDataTestId = 'mock-form';
const mockFormPath = '/quality/seedling/form';
const mockRoutes = {
  MockForm: {
    path: mockFormPath,
    component: () => <div data-testid={mockFormDataTestId}>mock form</div>,
  },
};

const mockTreeRoot = new SideNavTreeNode({ name: 'Quality' });
mockTreeRoot.addNode({
  name: 'Form',
  route: mockRoutes.MockForm,
  href: '/quality/seedling/form',
});

function renderQualityAppRouter(initialPath: string) {
  const history = createMemoryHistory({ initialEntries: [initialPath] });
  const { queryByTestId } = render(
    <Router history={history}>
      <QualityAppRouter routes={mockRoutes} treeRoot={mockTreeRoot} />
    </Router>
  );

  return { queryByTestId, history };
}

describe('QualityAppRouter', () => {
  it('redirects to /quality when there is no match', () => {
    const { history, queryByTestId } = renderQualityAppRouter('/quality/non-existent-page');

    expect(history.location.pathname).toBe('/quality');

    // doesn't render mock form or global site/farm selector.
    expect(queryByTestId(mockFormDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockGlobalSelectFarmDataTestId)).not.toBeInTheDocument();
  });

  it('renders left nav and component for matching route', () => {
    const { history, queryByTestId } = renderQualityAppRouter(mockFormPath);

    expect(history.location.pathname).toBe(mockFormPath);

    expect(queryByTestId(mockFormDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockGlobalSelectFarmDataTestId)).toBeInTheDocument();
  });
});
