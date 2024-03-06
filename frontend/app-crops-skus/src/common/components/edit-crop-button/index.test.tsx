import { EditButton } from '@plentyag/brand-ui/src/components/edit-button';
import { ChildCrop } from '@plentyag/core/src/farm-def/types';
import { render } from '@testing-library/react';
import { cloneDeep } from 'lodash';
import React from 'react';

import { useEditCropFormGenConfig } from '../../../common/hooks';
import { mockCrops } from '../../test-helpers';

import { CROP_CONFIRMATION_MESSAGE, EditCropButton, EMPTY_CHILD_CROP } from '.';

const fakeFormGenConfig = {};
jest.mock('../../../common/hooks');
const mockUseEditCropFormGenConfig = useEditCropFormGenConfig as jest.Mock;
mockUseEditCropFormGenConfig.mockReturnValue(fakeFormGenConfig);

jest.mock('@plentyag/brand-ui/src/components/edit-button');
const mockEditButton = EditButton as jest.Mock;
mockEditButton.mockReturnValue(<div />);

const mockOnEditSuccess = jest.fn();

describe('EditCropButton', () => {
  beforeEach(() => {
    mockEditButton.mockClear();
  });

  interface EditButtonOptions {
    isUpdating: boolean;
    disabled: boolean;
    confirmationMessage: string;
    mockInitialValues?: any;
  }
  function expectEditButtonToHaveBeenCalledWith({
    isUpdating,
    disabled,
    confirmationMessage,
    mockInitialValues,
  }: EditButtonOptions) {
    // expect two since minimum number of component crops is 2
    const mockEmptyInitialValues = {
      childCrops: [EMPTY_CHILD_CROP, EMPTY_CHILD_CROP],
    };
    expect(mockEditButton).toHaveBeenLastCalledWith(
      {
        formGenConfig: fakeFormGenConfig,
        layout: 'groupRow',
        initialValues: mockInitialValues || mockEmptyInitialValues,
        maxWidth: 'xl',
        isUpdating,
        confirmationMessage,
        disabled,
        onSuccess: mockOnEditSuccess,
      },
      expect.anything()
    );
  }

  it('disables button when editing crop (isUpdating: true) and crop is not provided', () => {
    render(<EditCropButton crop={undefined} crops={mockCrops} isUpdating onEditSuccess={mockOnEditSuccess} />);

    expectEditButtonToHaveBeenCalledWith({
      isUpdating: true,
      disabled: true,
      confirmationMessage: CROP_CONFIRMATION_MESSAGE,
    });
  });

  it('enables button when creating crop (isUpdating: false) and crop is not provided', () => {
    render(<EditCropButton crop={undefined} crops={mockCrops} isUpdating={false} onEditSuccess={mockOnEditSuccess} />);

    expectEditButtonToHaveBeenCalledWith({ isUpdating: false, disabled: false, confirmationMessage: undefined });
  });

  it('disables button when "crops" list is not provided', () => {
    render(<EditCropButton crop={undefined} crops={undefined} isUpdating={false} onEditSuccess={mockOnEditSuccess} />);

    expectEditButtonToHaveBeenCalledWith({ isUpdating: false, disabled: true, confirmationMessage: undefined });
  });

  it('passes initial childCrops value from the crop being edited', () => {
    const mockToEdit = mockCrops[1];
    render(<EditCropButton crop={mockToEdit} crops={mockCrops} isUpdating={false} onEditSuccess={mockOnEditSuccess} />);

    const mockInitialValues = {
      childCrops: mockToEdit.childCrops,
    };

    expectEditButtonToHaveBeenCalledWith({
      isUpdating: false,
      disabled: false,
      confirmationMessage: undefined,
      mockInitialValues,
    });
  });

  it('sets initial "childCrops" value to empty value when less than minimum of 2', () => {
    const mockToEdit = cloneDeep(mockCrops[1]);

    // delete 2nd childCrop and expect 2nd initial value in 'childCrops" to be emtpy value.
    mockToEdit.childCrops.splice(1, 1);

    render(<EditCropButton crop={mockToEdit} crops={mockCrops} isUpdating={false} onEditSuccess={mockOnEditSuccess} />);

    const childCrops: ChildCrop[] = [mockToEdit.childCrops[0], EMPTY_CHILD_CROP];
    const mockInitialValues = {
      childCrops,
    };

    expectEditButtonToHaveBeenCalledWith({
      isUpdating: false,
      disabled: false,
      confirmationMessage: undefined,
      mockInitialValues,
    });
  });
});
