import { mockAutocompleteDevice } from '@plentyag/app-devices/src/common/components/autocomplete-device/test-helpers';
import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { Device } from '@plentyag/app-devices/src/common/types';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { dataTestId } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsSwapDevices as dataTestIds, SwapDevices } from '.';
export { dataTestIdsSwapDevices, filterOptions } from '.';

export const devices = [mockDevices[0], mockDevices[1]]; // one with location, one without

jest.mock('@plentyag/app-devices/src/common/components/autocomplete-device', () => mockAutocompleteDevice(mockDevices));
jest.mock('@plentyag/core/src/hooks');

export const mockUsePostRequest = usePostRequest as jest.Mock;

export interface RenderSwapDevices {
  makeRequest?: () => {};
}

export function renderSwapDevices({ makeRequest = jest.fn() }: RenderSwapDevices) {
  mockUsePostRequest.mockReturnValue({ makeRequest });

  const rendered = render(<SwapDevices isLoading={false} devices={devices} />, {
    wrapper: props => <MemoryRouter {...props} />,
  });
  const { queryByTestId } = rendered;

  function getElement<T extends HTMLElement>(device: Device, dataTestIdSelector: string) {
    return queryByTestId(dataTestIds.tableRow(device)).querySelector<T>(dataTestId(dataTestIdSelector));
  }

  function expectStatusToBeActive(device: Device, dataTestIdSelector: string) {
    [
      dataTestIds.swapStatusLoading,
      dataTestIds.swapStatusNewDeviceSelected,
      dataTestIds.swapStatusSwapped,
      dataTestIds.swapStatusError,
    ].forEach(status => {
      if (status === dataTestIdSelector) {
        expect(getElement(device, status)).toBeInTheDocument();
      } else {
        expect(getElement(device, status)).not.toBeInTheDocument();
      }
    });
  }
  function expectStatusesNotToBeActive(device: Device) {
    expectStatusToBeActive(device, undefined);
  }

  return {
    ...rendered,
    makeRequest,
    getElement,
    expectStatusToBeActive,
    expectStatusesNotToBeActive,
  };
}
