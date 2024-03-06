import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsResetMapsButton as dataTestIds, ResetMapsButton } from '.';

jest.mock('@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter');
const mockResetAllParameters = jest.fn();
(useQueryParameter as jest.Mock).mockReturnValue({
  resetAllParameters: mockResetAllParameters,
});

describe('ResetMapsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resets when users confirm', () => {
    const mockOnMapsReset = jest.fn();
    const { queryByTestId } = render(<ResetMapsButton onMapsReset={mockOnMapsReset} />);

    // click reset button
    queryByTestId(dataTestIds.button).click();

    expect(mockOnMapsReset).not.toHaveBeenCalled();
    expect(mockResetAllParameters).not.toHaveBeenCalled();
    expect(queryByTestId(dataTestIds.dialogConfirmation.root)).toBeInTheDocument();

    // click confirm button
    queryByTestId(dataTestIds.dialogConfirmation.confirm).click();

    expect(mockOnMapsReset).toHaveBeenCalled();
    expect(mockResetAllParameters).toHaveBeenCalled();
  });

  it('does not reset when user does not confirm', () => {
    const { queryByTestId } = render(<ResetMapsButton />);

    // click reset button
    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialogConfirmation.root)).toBeInTheDocument();

    // click cancel button
    queryByTestId(dataTestIds.dialogConfirmation.cancel).click();

    expect(mockResetAllParameters).not.toHaveBeenCalled();
  });
});
