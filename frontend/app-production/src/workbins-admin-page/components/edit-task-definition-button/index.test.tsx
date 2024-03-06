import { EditButton } from '@plentyag/brand-ui/src/components/edit-button';
import { render } from '@testing-library/react';
import React from 'react';

import { useEditTaskDefinitionFormGenConfig } from '../../hooks/use-edit-task-definition-form-gen-config';

import { EditTaskDefinitionButton } from '.';

const fakeFormGenConfig = {};
jest.mock('../../hooks/use-edit-task-definition-form-gen-config');
const mockUseEditTaskDefinitionFormGenConfig = useEditTaskDefinitionFormGenConfig as jest.Mock;
mockUseEditTaskDefinitionFormGenConfig.mockReturnValue(fakeFormGenConfig);

jest.mock('@plentyag/brand-ui/src/components/edit-button');
const mockEditButton = EditButton as jest.Mock;
mockEditButton.mockReturnValue(<div />);

const mockOnEditSuccess = jest.fn();

describe('EditTaskDefinitionButton', () => {
  beforeEach(() => {
    mockEditButton.mockClear();
  });

  function expectEditButtonToHaveBeenCalledWith(isUpdating: boolean, disabled: boolean) {
    const defaultEmptyWorkbinDefinition = {
      createdAt: null,
      description: '',
      farm: null,
      fields: [],
      groups: [],
      id: null,
      priority: 'REGULAR',
      scheduled: false,
      shortTitle: null,
      sopLink: '',
      title: null,
      updatedAt: null,
      workbins: [],
      definitionCreatedByInternalService: false,
    };
    expect(mockEditButton).toHaveBeenLastCalledWith(
      {
        formGenConfig: fakeFormGenConfig,
        isUpdating: isUpdating,
        disabled: disabled,
        onSuccess: mockOnEditSuccess,
        initialValues: defaultEmptyWorkbinDefinition,
      },
      expect.anything()
    );
  }

  it('disables button when editing definition (isUpdating: true) and definition is not provided', () => {
    render(<EditTaskDefinitionButton taskDefinition={undefined} isUpdating onEditSuccess={mockOnEditSuccess} />);

    expectEditButtonToHaveBeenCalledWith(true, true);
  });

  it('enables button when creating definition (isUpdating: false) and definition is not provided', () => {
    render(
      <EditTaskDefinitionButton taskDefinition={undefined} isUpdating={false} onEditSuccess={mockOnEditSuccess} />
    );

    expectEditButtonToHaveBeenCalledWith(false, false);
  });
});
