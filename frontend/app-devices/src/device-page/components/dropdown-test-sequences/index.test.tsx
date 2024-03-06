import { mockPlacedHathorDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { Device } from '@plentyag/app-devices/src/common/types';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDropdownTestSequences as dataTestIds, DropdownTestSequences, testSequences } from '.';

import { TestSequenceName } from './types';

jest.mock('@plentyag/core/src/hooks');

const mockUsePostRequest = usePostRequest as jest.Mock;

const hathor = mockPlacedHathorDevices[1];

function renderButtonRebootDevice(device: Device) {
  const component = render(<DropdownTestSequences device={device} />, { wrapper: GlobalSnackbar });
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

describe('DropdownTestSequences', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
  });

  it('executes a TestSequence', async () => {
    const testSequence = testSequences.find(sequence => sequence.name === TestSequenceName.propagationLightingTest);
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId, expectDefaultState, expectConfirmationDefaultState } = renderButtonRebootDevice(hathor);

    expect(makeRequest).not.toHaveBeenCalled();
    expectDefaultState();

    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    expect(
      queryByTestId(dataTestIds.buttonTestSequence(TestSequenceName.verticalGrowShortLightingTest))
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(dataTestIds.buttonTestSequence(TestSequenceName.verticalGrowLongLightingTest))
    ).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonTestSequence(TestSequenceName.sprinkleTest))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonTestSequence(testSequence.name))).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.buttonTestSequence(testSequence.name)).click());

    expectConfirmationDefaultState();

    await actAndAwait(() => queryByTestId(dataTestIds.dialogConfirmation.confirm).click());

    expectDefaultState();
    expect(makeRequest).toHaveBeenCalledWith({
      url: testSequence.getRequestUrl(hathor),
      data: expect.objectContaining({
        ...testSequence.getRequestData(),
      }),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('does not execute the Test Sequence when cancelling out of the confirmation dialog', async () => {
    const makeRequest = jest.fn();
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId, expectDefaultState, expectConfirmationDefaultState } = renderButtonRebootDevice(hathor);

    expect(makeRequest).not.toHaveBeenCalled();
    expectDefaultState();

    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    await actAndAwait(() => queryByTestId(dataTestIds.buttonTestSequence(TestSequenceName.sprinkleTest)).click());

    expectConfirmationDefaultState();

    await actAndAwait(() => queryByTestId(dataTestIds.dialogConfirmation.cancel).click());

    expect(makeRequest).not.toHaveBeenCalled();
    expectDefaultState();
  });
});
