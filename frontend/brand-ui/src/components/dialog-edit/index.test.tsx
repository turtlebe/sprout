import { DialogBaseForm } from '@plentyag/brand-ui/src/components/dialog-base-form';
import { Can } from '@plentyag/core/src/components/can';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { render } from '@testing-library/react';
import React from 'react';

import { DialogEdit } from '.';

const mockFormGenConfig = {
  permissions: {
    create: {
      resource: Resources.HYP_CROPS,
      level: PermissionLevels.FULL,
    },
    update: {
      resource: Resources.HYP_CROPS,
      level: PermissionLevels.FULL,
    },
  },
};

jest.mock('@plentyag/core/src/components/can');
const mockCan = Can as jest.Mock;
mockCan.mockImplementation(props => <div>{props.children}</div>);

jest.mock('@plentyag/brand-ui/src/components/dialog-base-form');
const mockDialogBaseForm = DialogBaseForm as jest.Mock;
mockDialogBaseForm.mockReturnValue(<div data-testid="mock-dialog-base-form" />);

const mockOnSuccess = jest.fn();
const mockOnClose = jest.fn();

describe('DialogEdit', () => {
  beforeEach(() => {
    mockDialogBaseForm.mockClear();
    mockCan.mockClear();
  });

  it('does not render anything when open is false', () => {
    const { queryByTestId } = render(
      <DialogEdit
        formGenConfig={mockFormGenConfig}
        isUpdating
        open={false}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );

    expect(queryByTestId('mock-dialog-base-form')).not.toBeInTheDocument();
  });

  it('renders dialog when open is true', () => {
    const { queryByTestId } = render(
      <DialogEdit
        formGenConfig={mockFormGenConfig}
        isUpdating
        open={true}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );

    expect(queryByTestId('mock-dialog-base-form')).toBeInTheDocument();
  });

  it('sets IsUpdating to "true" when mode is "edit"', () => {
    render(
      <DialogEdit
        formGenConfig={mockFormGenConfig}
        isUpdating
        open={true}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );

    expect(mockDialogBaseForm).toHaveBeenCalledWith(
      {
        open: true,
        maxWidth: 'md',
        isUpdating: true,
        onClose: mockOnClose,
        onSuccess: mockOnSuccess,
        formGenConfig: mockFormGenConfig,
      },
      expect.anything()
    );
  });

  it('uses update permissions when mode is "edit"', () => {
    render(
      <DialogEdit
        formGenConfig={mockFormGenConfig}
        isUpdating
        open={true}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );

    expect(mockCan).toHaveBeenCalledWith(
      {
        resource: Resources.HYP_CROPS,
        level: PermissionLevels.FULL,
        onPermissionDenied: mockOnClose,
        children: expect.anything(),
      },
      expect.anything()
    );
  });

  it('uses create permissions when mode is "create"', () => {
    render(
      <DialogEdit
        formGenConfig={mockFormGenConfig}
        isUpdating={false}
        open={true}
        onSuccess={mockOnSuccess}
        onClose={mockOnClose}
      />
    );

    expect(mockCan).toHaveBeenCalledWith(
      {
        resource: Resources.HYP_CROPS,
        level: PermissionLevels.FULL,
        onPermissionDenied: mockOnClose,
        children: expect.anything(),
      },
      expect.anything()
    );
  });
});
