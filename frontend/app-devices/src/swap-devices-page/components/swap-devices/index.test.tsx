import { dataTestIds as autocompleteDeviceDataTestIds } from '@plentyag/app-devices/src/common/components/autocomplete-device/test-helpers';
import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';

import {
  dataTestIdsSwapDevices as dataTestIds,
  devices,
  filterOptions,
  mockUsePostRequest,
  renderSwapDevices,
} from './test-helper';

describe('SwapDevices', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
  });

  it('swaps a commissioned device for another one', () => {
    const { makeRequest, getElement, queryByTestId, expectStatusesNotToBeActive, expectStatusToBeActive } =
      renderSwapDevices({
        makeRequest: jest.fn().mockImplementation(({ data, onSuccess }) => {
          expect(data).toEqual({ deviceId: devices[1].id, newDeviceId: devices[0].id });
          onSuccess();
        }),
      });

    // -> CTA is inactive
    expect(queryByTestId(dataTestIds.swapDevices)).toBeDisabled();
    expect(queryByTestId(dataTestIds.swapDevices)).toHaveTextContent('Swap Devices (0)');
    expect(queryByTestId(dataTestIds.tableRow(devices[0]))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(devices[1]))).toBeInTheDocument();
    expect(getElement(devices[1], dataTestIds.tableCellNewDevice)).not.toHaveTextContent(devices[0].deviceTypeName);
    expect(getElement(devices[1], dataTestIds.tableCellNewDevice)).not.toHaveTextContent(devices[0].serial);

    // -> 1st row does not have an AutocompleteDevice component (decommissioned)
    expect(getElement(devices[0], autocompleteDeviceDataTestIds.button(devices[0]))).not.toBeInTheDocument();

    // -> No Status
    expectStatusesNotToBeActive(devices[0]);

    // -> 2nd row has an AutocompleteDevice component
    expect(getElement(devices[1], autocompleteDeviceDataTestIds.button(devices[0]))).toBeInTheDocument();
    expectStatusesNotToBeActive(devices[1]);

    // -> Select 2nd Device
    getElement(devices[1], autocompleteDeviceDataTestIds.button(devices[0])).click();

    // -> Status becomes Selected
    expectStatusToBeActive(devices[1], dataTestIds.swapStatusNewDeviceSelected);

    // -> CTA becomes active
    expect(queryByTestId(dataTestIds.swapDevices)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.swapDevices)).toHaveTextContent('Swap Devices (1)');

    queryByTestId(dataTestIds.swapDevices).click();

    expect(makeRequest).toHaveBeenCalledTimes(1);

    // -> Status becomes Swapped
    expectStatusToBeActive(devices[1], dataTestIds.swapStatusSwapped);
    expect(getElement(devices[1], dataTestIds.tableCellNewDevice)).toHaveTextContent(devices[0].deviceTypeName);
    expect(getElement(devices[1], dataTestIds.tableCellNewDevice)).toHaveTextContent(devices[0].serial);
  });

  it('shows a loader while swapping devices', () => {
    const { getElement, queryByTestId, expectStatusToBeActive, expectStatusesNotToBeActive } = renderSwapDevices({});

    expectStatusesNotToBeActive(devices[0]);
    expectStatusesNotToBeActive(devices[1]);

    // -> Selects a Device and click Swap CTA
    getElement(devices[1], autocompleteDeviceDataTestIds.button(devices[0])).click();
    queryByTestId(dataTestIds.swapDevices).click();

    // -> Status becomes Loading
    expectStatusToBeActive(devices[1], dataTestIds.swapStatusLoading);
  });

  it('shows an error when new device is already commissioned', () => {
    const { getElement, expectStatusesNotToBeActive, expectStatusToBeActive } = renderSwapDevices({
      makeRequest: jest.fn().mockImplementation(({ data, onSuccess }) => {
        expect(data).toEqual({ deviceId: devices[1].id, newDeviceId: devices[0].id });
        onSuccess();
      }),
    });

    // -> No Status
    expectStatusesNotToBeActive(devices[1]);

    // -> Select a Device that is already commissioned
    getElement(devices[1], autocompleteDeviceDataTestIds.button(devices[1])).click();

    // -> Status becomes Error
    expectStatusToBeActive(devices[1], dataTestIds.swapStatusError);
  });

  it('shows an error when something wrong happens', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { makeRequest, getElement, queryByTestId, expectStatusToBeActive, expectStatusesNotToBeActive } =
      renderSwapDevices({
        makeRequest: jest.fn().mockImplementation(({ onError }) => onError('error')),
      });

    expectStatusesNotToBeActive(devices[0]);
    expectStatusesNotToBeActive(devices[1]);

    // -> Selects a Device and click Swap CTA
    getElement(devices[1], autocompleteDeviceDataTestIds.button(devices[0])).click();
    queryByTestId(dataTestIds.swapDevices).click();

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledTimes(1);

    expectStatusToBeActive(devices[1], dataTestIds.swapStatusError);
  });
});

describe('filterOptions', () => {
  it('filters out devices that are not the same type', () => {
    expect(filterOptions([mockDevices[2], mockDevices[3]], mockDevices[1])).toHaveLength(0);
  });

  it('filters out devices that are commissioned', () => {
    expect(filterOptions([mockDevices[0], mockDevices[1]], mockDevices[1])).toHaveLength(1);
  });
});
