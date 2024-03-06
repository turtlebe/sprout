import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { dataTestIdsSideNavLayout as dataTestIds, SideNavLayout } from '.';

import { location, match, routes, treeRoot } from './test-helpers';

const fakeGlobalSelectFarmDataTestId = 'fake-global-picker';
jest.mock('../global-select-farm', () => ({
  GlobalSelectFarm: jest.fn(() => <div data-testid={fakeGlobalSelectFarmDataTestId} />),
}));

describe('SideNavLayout', () => {
  function renderSideNavLayout(showSideNav = true, showGlobalSelectFarm = true) {
    const history = createMemoryHistory({ initialEntries: [routes.Page1.path.toString()] });
    return render(
      <Router history={history}>
        <SideNavLayout
          showSideNav={showSideNav}
          showGlobalSelectFarm={showGlobalSelectFarm}
          history={history}
          match={match}
          location={location}
          routes={routes}
          treeRoot={treeRoot}
        />
      </Router>
    );
  }
  it('renders a side navigation and all routes through SideNavLayout', () => {
    const { queryByTestId } = renderSideNavLayout();

    expect(queryByTestId(dataTestIds.drawer)).toBeInTheDocument();
    expect(queryByTestId(fakeGlobalSelectFarmDataTestId)).toBeInTheDocument();

    expect(queryByTestId('page1')).toBeInTheDocument();
    expect(queryByTestId('page2')).not.toBeInTheDocument();

    queryByTestId('root/Group1/InternalLink2').querySelector('a').click();

    expect(queryByTestId('page1')).not.toBeInTheDocument();
    expect(queryByTestId('page2')).toBeInTheDocument();
  });

  it('does not render the tree view when "showSideNav" prop is false', () => {
    const { queryByTestId } = renderSideNavLayout(false);

    expect(queryByTestId(dataTestIds.drawer)).not.toBeInTheDocument();
    expect(queryByTestId(fakeGlobalSelectFarmDataTestId)).not.toBeInTheDocument();
  });

  it('does not render the GlobalSelectFarm when "showGlobalSelectFarm" is false', () => {
    const { queryByTestId } = renderSideNavLayout(true, false);

    expect(queryByTestId(fakeGlobalSelectFarmDataTestId)).not.toBeInTheDocument();
  });
});
