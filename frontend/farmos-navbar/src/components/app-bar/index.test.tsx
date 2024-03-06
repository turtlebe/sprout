import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { dataTestIds as buttonMenuWithDrawerDataTestIds } from '../button-menu-with-drawer';
import { dataTestIds as linkDataTestIds } from '../link-farmos-module';

import { AppBar, dataTestIds } from './index';

import { useOverflowElement } from './hooks/use-overflow-element';

jest.mock('./hooks/use-overflow-element');

describe('AppBar', () => {
  beforeEach(() => {
    (useOverflowElement as jest.Mock).mockReturnValue({ isOverflowing: false });
  });

  function renderAppBar(modules: string[] = ['HYP_ADMIN', 'HYP_LAB_TESTING']) {
    return render(
      <Router>
        <AppBar farmOsModules={modules} />
      </Router>
    );
  }

  it('renders an empty AppBar', () => {
    const { getByTestId } = renderAppBar([]);

    expect(getByTestId(dataTestIds.toolbar)).toBeEmptyDOMElement();
  });

  it('renders with authorized modules', () => {
    const { getByTestId, queryAllByTestId } = renderAppBar();

    expect(getByTestId(dataTestIds.toolbar)).not.toBeEmptyDOMElement();
    expect(queryAllByTestId(linkDataTestIds.root)).toHaveLength(2);
  });

  it('does not render ButtonMenuWithDrawer when not overflowing but displays the links', () => {
    const { queryByTestId, queryAllByTestId } = renderAppBar();

    expect(queryByTestId(buttonMenuWithDrawerDataTestIds.root)).not.toBeInTheDocument();

    expect(queryByTestId(dataTestIds.farmosModuleContainer)).toHaveStyle({ visibility: 'visible' });
    expect(queryAllByTestId(linkDataTestIds.root)).toHaveLength(2);
  });

  it('renders ButtonMenuWithDrawer when overflowing and hides the links', () => {
    (useOverflowElement as jest.Mock).mockReturnValue({ isOverflowing: true });

    const { queryByTestId, queryAllByTestId } = renderAppBar();

    expect(queryByTestId(buttonMenuWithDrawerDataTestIds.root)).toBeInTheDocument();

    expect(queryByTestId(dataTestIds.farmosModuleContainer)).toHaveStyle({ visibility: 'hidden' });
    expect(queryAllByTestId(linkDataTestIds.root)).toHaveLength(2);
  });
});
