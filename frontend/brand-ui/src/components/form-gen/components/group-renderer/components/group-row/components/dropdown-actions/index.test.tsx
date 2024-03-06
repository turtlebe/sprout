import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDropdownActions as dataTestIds, DropdownActions, getDropdownActionsDataTestIds } from '.';

const classDisabled = 'Mui-disabled';

const mockOnClone = jest.fn();
const mockOnRemove = jest.fn();

describe('DropdownActions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders only clone action', () => {
    const { queryByTestId } = render(<DropdownActions onClone={mockOnClone} />);

    expect(queryByTestId(dataTestIds.dropdown)).toBeInTheDocument();
    queryByTestId(dataTestIds.dropdown).click();

    // Only clone action should be in document
    expect(queryByTestId(dataTestIds.dropdownClone)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dropdownRemove)).not.toBeInTheDocument();
  });

  it('renders only remove action', () => {
    const { queryByTestId } = render(
      <DropdownActions minRowCountForRemove={1} onRemove={mockOnRemove} totalRowCount={2} />
    );

    // With no cloning and only remove action, there's no dropdown
    expect(queryByTestId(dataTestIds.dropdown)).not.toBeInTheDocument();

    // Only remove should be in document
    expect(queryByTestId(dataTestIds.remove)).toBeInTheDocument();
  });

  it('renders no remove action when minRowCountForRemove is greater or equal than totalRowCount', () => {
    const { queryByTestId } = render(
      <DropdownActions minRowCountForRemove={1} onRemove={mockOnRemove} totalRowCount={1} />
    );

    // With no cloning and only remove action, there's no dropdown
    expect(queryByTestId(dataTestIds.dropdown)).not.toBeInTheDocument();

    // There's also no remove action at all, since minRowCountForRemove >= totalRowCount
    expect(queryByTestId(dataTestIds.remove)).not.toBeInTheDocument();
  });

  it('renders both clone and remove actions disabled', () => {
    const { queryByTestId } = render(
      <DropdownActions
        onClone={mockOnClone}
        onRemove={mockOnRemove}
        minRowCountForRemove={1}
        totalRowCount={2}
        disabled={true}
      />
    );

    expect(queryByTestId(dataTestIds.dropdown)).toBeInTheDocument();
    queryByTestId(dataTestIds.dropdown).click();

    // Clone and remove should be disabled, because disabled=true
    expect(queryByTestId(dataTestIds.dropdownClone)).toHaveClass(classDisabled);
    expect(queryByTestId(dataTestIds.dropdownRemove)).toHaveClass(classDisabled);
  });

  it('calls clone action, without rendered remove action', () => {
    const { queryByTestId } = render(<DropdownActions onClone={mockOnClone} />);

    expect(mockOnClone).not.toHaveBeenCalled();
    expect(mockOnRemove).not.toHaveBeenCalled();

    expect(queryByTestId(dataTestIds.dropdown)).toBeInTheDocument();
    queryByTestId(dataTestIds.dropdown).click();

    expect(queryByTestId(dataTestIds.dropdownClone)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dropdownRemove)).not.toBeInTheDocument();
    queryByTestId(dataTestIds.dropdownClone).click();

    expect(mockOnClone).toHaveBeenCalled();
    expect(mockOnRemove).not.toHaveBeenCalled();
  });

  it('calls clone action, with rendered remove action', () => {
    const { queryByTestId } = render(
      <DropdownActions onClone={mockOnClone} minRowCountForRemove={1} onRemove={mockOnRemove} totalRowCount={2} />
    );

    expect(mockOnClone).not.toHaveBeenCalled();
    expect(mockOnRemove).not.toHaveBeenCalled();

    expect(queryByTestId(dataTestIds.dropdown)).toBeInTheDocument();
    queryByTestId(dataTestIds.dropdown).click();

    expect(queryByTestId(dataTestIds.dropdownClone)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dropdownRemove)).toBeInTheDocument();
    queryByTestId(dataTestIds.dropdownClone).click();

    expect(mockOnClone).toHaveBeenCalled();
    expect(mockOnRemove).not.toHaveBeenCalled();
  });

  it('calls remove, with rendered clone action', () => {
    const { queryByTestId } = render(
      <DropdownActions onClone={mockOnClone} minRowCountForRemove={1} onRemove={mockOnRemove} totalRowCount={2} />
    );

    expect(mockOnClone).not.toHaveBeenCalled();
    expect(mockOnRemove).not.toHaveBeenCalled();

    expect(queryByTestId(dataTestIds.dropdown)).toBeInTheDocument();
    queryByTestId(dataTestIds.dropdown).click();

    expect(queryByTestId(dataTestIds.dropdownClone)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dropdownRemove)).toBeInTheDocument();
    queryByTestId(dataTestIds.dropdownRemove).click();

    expect(mockOnClone).not.toHaveBeenCalled();
    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('returns custom dataTestIds', () => {
    expect(getDropdownActionsDataTestIds('prefix')).toEqual({
      root: 'prefix',
      remove: 'prefix-dropdown-group-actions-remove',
      dropdown: 'prefix-dropdown-group-actions-dropdown',
      dropdownClone: 'prefix-dropdown-group-actions-dropdown-clone',
      dropdownRemove: 'prefix-dropdown-group-actions-dropdown-remove',
    });
  });
});
