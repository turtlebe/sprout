import { mockPlacedHathorDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { Device } from '@plentyag/app-devices/src/common/types';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonRebootDevice, dataTestIdsButtonRebootDevice as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUsePostRequest = usePostRequest as jest.Mock;

const hathor = mockPlacedHathorDevices[0];

function renderButtonRebootDevice(device: Device) {
  const component = render(<ButtonRebootDevice device={device} />, { wrapper: GlobalSnackbar });
  const { queryByTestId } = component;

  function expectDefaultState() {
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogConfirmation.confirm)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogConfirmation.cancel)).not.toBeInTheDocument();
  }

  function expectConfirmationDefaultState() {
    expect(queryByTestId(dataTestIds.dialogConfirmation.confirm)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogConfirmation.cancel)).toBeInTheDocument();
  }

  return {
    ...component,
    expectDefaultState,
    expectConfirmationDefaultState,
  };
}

describe('ButtonRebootDevice', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
  });

  it('reboots the device', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId, expectDefaultState, expectConfirmationDefaultState } = renderButtonRebootDevice(hathor);

    expect(makeRequest).not.toHaveBeenCalled();
    expectDefaultState();

    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    expectConfirmationDefaultState();

    await actAndAwait(() => queryByTestId(dataTestIds.dialogConfirmation.confirm).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({
        command: 'REBOOT',
      }),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('cancels the reboot of the device', async () => {
    const makeRequest = jest.fn();
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId, expectDefaultState, expectConfirmationDefaultState } = renderButtonRebootDevice(hathor);

    expect(makeRequest).not.toHaveBeenCalled();
    expectDefaultState();

    queryByTestId(dataTestIds.root).click();

    expectConfirmationDefaultState();

    await actAndAwait(() => queryByTestId(dataTestIds.dialogConfirmation.cancel).click());

    expect(makeRequest).not.toHaveBeenCalled();
  });
});
