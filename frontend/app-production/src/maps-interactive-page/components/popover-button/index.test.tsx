import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';

import { dataTestIdsPopoverButton as dataTestIds, PopoverButton } from '.';

const mockTitle = 'mock title';
const mockIconDataTestId = 'mock-icon';
const mockIcon = <div data-testid={mockIconDataTestId}>mock icon</div>;

describe('PopoverButton', () => {
  function renderPopoverButton(hasItems = true) {
    const mockHandleClear = jest.fn();
    const result = render(
      <PopoverButton buttonTitle={mockTitle} icon={mockIcon} handleClear={hasItems ? mockHandleClear : undefined} />
    );

    return { ...result, mockHandleClear };
  }

  it('renders the button', () => {
    const { queryByTestId } = renderPopoverButton(false);

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();

    // doesn't show the delete icon when callback not provided.
    expect(queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon')).not.toBeInTheDocument();

    expect(queryByTestId(dataTestIds.button)).toHaveTextContent(mockTitle);
    expect(queryByTestId(mockIconDataTestId)).toBeInTheDocument();
  });

  it('shows popover when clicking on button', () => {
    const { queryByTestId } = renderPopoverButton();

    expect(queryByTestId(dataTestIds.popoverContent)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.popoverContent)).toBeInTheDocument();
  });

  it('hides popover when clicking on button again', async () => {
    const { queryByTestId } = renderPopoverButton();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.popoverContent)).toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    await waitFor(() => expect(queryByTestId(dataTestIds.popoverContent)).not.toBeInTheDocument());
  });

  it('shows clear button when callback is provided', () => {
    const { queryByTestId } = renderPopoverButton();

    expect(queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon')).toBeInTheDocument();
  });

  it('invokes callback when clicking on the clear button', () => {
    const { queryByTestId, mockHandleClear } = renderPopoverButton();

    const deleteButton = queryByTestId(dataTestIds.button).querySelector('svg.MuiChip-deleteIcon');
    expect(deleteButton).toBeInTheDocument();

    expect(mockHandleClear).not.toHaveBeenCalled();

    fireEvent.click(deleteButton);

    expect(mockHandleClear).toHaveBeenCalled();
  });
});
