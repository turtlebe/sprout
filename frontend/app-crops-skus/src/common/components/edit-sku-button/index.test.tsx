import { EditButton } from '@plentyag/brand-ui/src/components/edit-button';
import { render } from '@testing-library/react';
import React from 'react';

import { useEditSkuFormGenConfig } from '../../../common/hooks';
import { mockSkus } from '../../test-helpers';

import { EditSkuButton, SKU_CONFIRMATION_MESSAGE } from '.';

const fakeFormGenConfig = {};
jest.mock('../../../common/hooks');
const mockUseEditSkuFormGenConfig = useEditSkuFormGenConfig as jest.Mock;
mockUseEditSkuFormGenConfig.mockReturnValue(fakeFormGenConfig);

jest.mock('@plentyag/brand-ui/src/components/edit-button');
const mockEditButton = EditButton as jest.Mock;
mockEditButton.mockReturnValue(<div />);

const mockOnEditSuccess = jest.fn();

describe('EditSkuCropButton', () => {
  beforeEach(() => {
    mockEditButton.mockClear();
  });

  function expectEditButtonToHaveBeenCalledWith(isUpdating: boolean, disabled: boolean, confirmationMessage: string) {
    expect(mockEditButton).toHaveBeenLastCalledWith(
      {
        formGenConfig: fakeFormGenConfig,
        isUpdating,
        confirmationMessage,
        disabled,
        onSuccess: mockOnEditSuccess,
      },
      expect.anything()
    );
  }

  it('disables button when editing sku (isUpdating: true) and sku is not provided', () => {
    render(<EditSkuButton sku={undefined} skus={mockSkus} isUpdating onEditSuccess={mockOnEditSuccess} />);

    expectEditButtonToHaveBeenCalledWith(true, true, SKU_CONFIRMATION_MESSAGE);
  });

  it('enables button when creating sku (isUpdating: false) and sku is not provided', () => {
    render(<EditSkuButton sku={undefined} skus={mockSkus} isUpdating={false} onEditSuccess={mockOnEditSuccess} />);

    expectEditButtonToHaveBeenCalledWith(false, false, undefined);
  });

  it('disables button when "skus" list is not provided', () => {
    render(<EditSkuButton sku={undefined} skus={undefined} isUpdating={false} onEditSuccess={mockOnEditSuccess} />);

    expectEditButtonToHaveBeenCalledWith(false, true, undefined);
  });
});
