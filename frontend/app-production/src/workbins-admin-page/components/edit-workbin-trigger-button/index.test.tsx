import { EditButton } from '@plentyag/brand-ui/src/components/edit-button';
import { render } from '@testing-library/react';
import React from 'react';

import { useEditWorkbinTriggerFormGenConfig } from '../../hooks/use-edit-workbin-trigger-form-gen-config';

import { EditWorkbinTriggerButton } from '.';

const fakeFormGenConfig = {
  config: { title: 'Test Workbin Trigger Button' },
  isLoadingDefinitions: false,
};
jest.mock('../../hooks/use-edit-workbin-trigger-form-gen-config');
const mockUseEditTriggerFormGenConfig = useEditWorkbinTriggerFormGenConfig as jest.Mock;
mockUseEditTriggerFormGenConfig.mockReturnValue(fakeFormGenConfig);

jest.mock('@plentyag/brand-ui/src/components/edit-button');
const mockEditButton = EditButton as jest.Mock;
mockEditButton.mockReturnValue(<div />);

const mockOnEditSuccess = jest.fn();

describe('EditWorkbinTriggerButton', () => {
  beforeEach(() => {
    mockEditButton.mockClear();
  });

  function expectEditButtonToHaveBeenCalledWith(isUpdating: boolean, disabled: boolean) {
    expect(mockEditButton).toHaveBeenLastCalledWith(
      {
        formGenConfig: fakeFormGenConfig.config,
        isUpdating: isUpdating,
        disabled: disabled,
        onSuccess: mockOnEditSuccess,
      },
      expect.anything()
    );
  }

  it('disables button when editing trigger (isUpdating: true) and trigger is not provided', () => {
    render(<EditWorkbinTriggerButton workbinTrigger={undefined} isUpdating onEditSuccess={mockOnEditSuccess} />);

    expectEditButtonToHaveBeenCalledWith(true, true);
  });

  it('enables button when creating trigger (isUpdating: false) and trigger is not provided', () => {
    render(
      <EditWorkbinTriggerButton workbinTrigger={undefined} isUpdating={false} onEditSuccess={mockOnEditSuccess} />
    );

    expectEditButtonToHaveBeenCalledWith(false, false);
  });
});
