import { queryByTestId as queryByTestIdUsingContainer, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';

import { match, routes, treeRoot } from '../test-helpers';

import { treeViewDataTestIds as dataTestIds, TreeView } from '.';

describe('TreeView', () => {
  it('expands everything by default', () => {
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={[routes.Page1.path.toString()]}>
        <TreeView treeRoot={treeRoot} treePaths={treeRoot.getTreePath(match)} />
      </MemoryRouter>
    );

    expect(queryByTestId('root/Group1/InternalLink1')).toBeInTheDocument();
    expect(queryByTestId('root/Group2/ExternalLink')).toBeInTheDocument();
  });

  it('marks the current route as active', () => {
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={[routes.Page1.path.toString()]}>
        <TreeView treeRoot={treeRoot} treePaths={treeRoot.getTreePath(match)} />
      </MemoryRouter>
    );

    expect(queryByTestId('root/Group1/InternalLink1').querySelector('a')).toHaveAttribute('aria-current', 'page');
    expect(queryByTestId('root/Group2/ExternalLink').querySelector('a')).not.toHaveAttribute('aria-current');
  });

  it('navigates through the Router', () => {
    const history = createMemoryHistory({ initialEntries: [routes.Page1.path.toString()] });
    const push = jest.spyOn(history, 'push');
    const { queryByTestId } = render(
      <Router history={history}>
        <TreeView treeRoot={treeRoot} treePaths={treeRoot.getTreePath(match)} />
      </Router>
    );

    queryByTestId('root/Group1/InternalLink2').querySelector('a').click();
    expect(push).toHaveBeenCalled();
    expect(history.location.pathname).toBe(routes.Page2.path);
  });

  it('navigates outside the Router', () => {
    const history = createMemoryHistory({ initialEntries: [routes.Page1.path.toString()] });
    const push = jest.spyOn(history, 'push');
    const { queryByTestId } = render(
      <Router history={history}>
        <TreeView treeRoot={treeRoot} treePaths={treeRoot.getTreePath(match)} />
      </Router>
    );

    queryByTestId('root/Group2/ExternalLink').querySelector('a').click();
    expect(push).not.toHaveBeenCalled();
  });

  it('optionally shows node as loading', () => {
    const history = createMemoryHistory({ initialEntries: [routes.Page1.path.toString()] });
    const { queryByTestId } = render(
      <Router history={history}>
        <TreeView treeRoot={treeRoot} treePaths={treeRoot.getTreePath(match)} />
      </Router>
    );

    // expect Group3 to have progress loader.
    const group3 = queryByTestId('root/Group3');
    expect(queryByTestIdUsingContainer(group3, dataTestIds.loading)).toBeInTheDocument();
  });
});
