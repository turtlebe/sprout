import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIds, ResetGridMenu } from '.';

describe('ResetGridMenu', () => {
  it('menu is closed by default', () => {
    const { queryByTestId } = render(<ResetGridMenu />);
    expect(queryByTestId(dataTestIds.menu)).not.toBeInTheDocument();
  });

  it('opens menu when clicking button', () => {
    const { queryByTestId } = render(<ResetGridMenu />);
    queryByTestId(dataTestIds.button).click();
    expect(queryByTestId(dataTestIds.menu)).toBeInTheDocument();
  });

  it('calls tableApi.resetGrid when menu option is selected and closes menu', () => {
    const mockTableApi = {
      resetGrid: jest.fn(),
      clearSelection: () => {},
      refreshCache: () => {},
      columnApi: null,
      gridApi: null,
    };
    const { queryByTestId } = render(<ResetGridMenu tableApi={mockTableApi} />);
    queryByTestId(dataTestIds.button).click();
    const menuItems = queryByTestId(dataTestIds.menu).getElementsByTagName('li');
    expect(menuItems).toHaveLength(3);

    expect(mockTableApi.resetGrid).not.toHaveBeenCalled();
    menuItems[0].click();
    expect(mockTableApi.resetGrid).toHaveBeenCalled();

    expect(queryByTestId(dataTestIds.menu)).toBeInTheDocument();
  });
});
