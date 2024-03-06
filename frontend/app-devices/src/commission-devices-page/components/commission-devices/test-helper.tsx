import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { Device } from '@plentyag/app-devices/src/common/types';
import { mockAutocompleteFarmDefObject } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import { useGetRequest, usePostRequest } from '@plentyag/core/src/hooks';
import { dataTestId } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { CommissionDevices, dataTestIdsCommissionDevices as dataTestIds } from '.';
export { CommissionDevices, dataTestIdsCommissionDevices } from '.';

export const dataTestIdsAutocompleteFarmDefObject = {
  validDeviceLocation: 'validDeviceLocation',
  invalidDeviceLocation: 'invalidDeviceLocation',
};

jest.mock('@plentyag/brand-ui/src/components/autocomplete-farm-def-object', () =>
  mockAutocompleteFarmDefObject([
    // cannot reference variable outside of the scope when using jest.mock
    { valueOnChange: mockDevices[1].location, dataTestId: 'validDeviceLocation' },
    { valueOnChange: null, dataTestId: 'invalidDeviceLocation' },
  ])
);
jest.mock('@plentyag/core/src/hooks');

export const devices = mockDevices.filter(device => !device.location);
export const mockUseGetRequest = useGetRequest as jest.Mock;
export const mockUsePostRequest = usePostRequest as jest.Mock;

export interface RenderCommissionDevices {
  devices?: Device[];
  isLoading?: boolean;
}

export function renderCommissionDevices({ isLoading = false, devices = [] }: RenderCommissionDevices) {
  const rendered = render(
    <GlobalSnackbar>
      <MemoryRouter>
        <CommissionDevices isLoading={isLoading} devices={devices} />
      </MemoryRouter>
    </GlobalSnackbar>
  );
  const { queryByTestId } = rendered;

  function getElement<T extends HTMLElement>(device: Device, dataTestIdSelector: string) {
    return queryByTestId(dataTestIds.tableRow(device)).querySelector<T>(dataTestId(dataTestIdSelector));
  }

  function expectNoStatus(device: Device) {
    expect(getElement(device, dataTestIds.statusLoading)).not.toBeInTheDocument();
    expect(getElement(device, dataTestIds.statusUnavailable)).not.toBeInTheDocument();
    expect(getElement(device, dataTestIds.statusAvailable)).not.toBeInTheDocument();
    expect(getElement(device, dataTestIds.statusComplete)).not.toBeInTheDocument();
  }

  return {
    ...rendered,
    getElement,
    expectNoStatus,
  };
}
