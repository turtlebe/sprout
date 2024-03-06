import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDropdown as dataTestIds, Dropdown, DropdownItem } from '.';

describe('Dropdown', () => {
  it('renders with children', () => {
    const { queryByTestId } = render(
      <Dropdown label="actions">
        <DropdownItem>Item1</DropdownItem>
      </Dropdown>
    );

    expect(queryByTestId(dataTestIds.button)).toHaveTextContent('actions');
    expect(queryByTestId(dataTestIds.menu)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.menu)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.menu)).toHaveTextContent('Item1');
  });

  it('renders with a custom "data-testid" tag', () => {
    const { queryByTestId } = render(
      <Dropdown label="actions" data-testid="custom-datatestid">
        <DropdownItem data-testid="item1">Item1</DropdownItem>
      </Dropdown>
    );

    expect(queryByTestId('custom-datatestid')).toHaveTextContent('actions');
    expect(queryByTestId(dataTestIds.menu)).not.toBeInTheDocument();

    queryByTestId('custom-datatestid').click();

    expect(queryByTestId(dataTestIds.menu)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.menu)).toHaveTextContent('Item1');
    expect(queryByTestId('item1')).toHaveTextContent('Item1');
  });

  it('renders with a IconButton when label is absent', () => {
    const { queryByTestId } = render(
      <Dropdown>
        <DropdownItem>Item1</DropdownItem>
      </Dropdown>
    );

    expect(queryByTestId(dataTestIds.button)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.menu)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.iconButton)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.iconButton)).not.toBeDisabled();

    queryByTestId(dataTestIds.iconButton).click();

    expect(queryByTestId(dataTestIds.menu)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.menu)).toHaveTextContent('Item1');
  });

  it('renders with a custom icon when label is absent', () => {
    const Icon = () => <div data-testid="custom-icon" />;
    const { queryByTestId } = render(
      <Dropdown icon={Icon}>
        <DropdownItem>Item1</DropdownItem>
      </Dropdown>
    );

    expect(queryByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with a disabled state', () => {
    const { queryByTestId } = render(
      <Dropdown disabled>
        <DropdownItem>Item1</DropdownItem>
      </Dropdown>
    );

    expect(queryByTestId(dataTestIds.iconButton)).toBeDisabled();
  });
});
