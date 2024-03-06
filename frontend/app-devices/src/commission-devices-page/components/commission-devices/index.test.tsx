import { dataTestIdsTableRowLoadingPlaceholder } from '@plentyag/app-devices/src/common/components';
import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { actAndAwait } from '@plentyag/core/src/test-helpers';

import {
  dataTestIdsAutocompleteFarmDefObject,
  dataTestIdsCommissionDevices,
  devices,
  mockUseGetRequest,
  mockUsePostRequest,
  renderCommissionDevices,
} from './test-helper';

const dataTestIds = {
  ...dataTestIdsCommissionDevices,
  ...dataTestIdsAutocompleteFarmDefObject,
};

describe('CommissionDevices', () => {
  beforeEach(() => {
    mockUseGetRequest.mockRestore();
    mockUsePostRequest.mockRestore();
  });

  it('renders a loading state', () => {
    const { queryByTestId } = renderCommissionDevices({ isLoading: true });

    expect(queryByTestId(dataTestIdsTableRowLoadingPlaceholder.loader)).toBeInTheDocument();
  });

  it('renders an empty state', () => {
    const { queryByTestId } = renderCommissionDevices({});

    expect(queryByTestId(dataTestIdsTableRowLoadingPlaceholder.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableBody)).toHaveTextContent('No Devices');
  });

  it('renders a list of devices', () => {
    const { queryByTestId } = renderCommissionDevices({ devices });

    const [device1, device2] = devices;

    expect(queryByTestId(dataTestIds.tableRow(device1))).toHaveTextContent(device1.deviceTypeName);
    expect(queryByTestId(dataTestIds.tableRow(device1))).toHaveTextContent(device1.serial);
    expect(queryByTestId(dataTestIds.tableRow(device2))).toHaveTextContent(device2.deviceTypeName);
    expect(queryByTestId(dataTestIds.tableRow(device2))).toHaveTextContent(device2.serial);
  });

  it('validates that a device location is available', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError({ status: 404 }));
    mockUseGetRequest.mockReturnValue({ makeRequest });

    const { getElement } = renderCommissionDevices({ devices });

    expect(getElement(devices[0], dataTestIds.statusAvailable)).not.toBeInTheDocument();

    await actAndAwait(() => getElement(devices[0], dataTestIds.validDeviceLocation).click());

    expect(makeRequest).toHaveBeenCalled();
    expect(getElement(devices[0], dataTestIds.statusAvailable)).toBeInTheDocument();
  });

  it('shows an error when a device location is unavailable', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({}));
    mockUseGetRequest.mockReturnValue({ makeRequest });

    const { getElement } = renderCommissionDevices({ devices });

    expect(getElement(devices[0], dataTestIds.statusUnavailable)).not.toBeInTheDocument();

    await actAndAwait(() => getElement(devices[0], dataTestIds.validDeviceLocation).click());

    expect(makeRequest).toHaveBeenCalled();
    expect(getElement(devices[0], dataTestIds.statusUnavailable)).toBeInTheDocument();
  });

  it('shows an error when a device location has already been selected', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError({ status: 404 }));
    mockUseGetRequest.mockReturnValue({ makeRequest });

    const { getElement } = renderCommissionDevices({ devices });

    expect(getElement(devices[0], dataTestIds.statusUnavailable)).not.toBeInTheDocument();
    expect(getElement(devices[1], dataTestIds.statusUnavailable)).not.toBeInTheDocument();

    await actAndAwait(() => getElement(devices[0], dataTestIds.validDeviceLocation).click());

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(getElement(devices[0], dataTestIds.statusAvailable)).toBeInTheDocument();

    await actAndAwait(() => getElement(devices[1], dataTestIds.validDeviceLocation).click());

    expect(getElement(devices[1], dataTestIds.statusUnavailable)).toBeInTheDocument();
  });

  it('shows a loader while resolving the device location availability', async () => {
    const makeRequest = jest.fn();
    mockUseGetRequest.mockReturnValue({ makeRequest });

    const { getElement } = renderCommissionDevices({ devices });

    expect(getElement(devices[0], dataTestIds.statusLoading)).not.toBeInTheDocument();

    await actAndAwait(() => getElement(devices[0], dataTestIds.validDeviceLocation).click());

    expect(makeRequest).toHaveBeenCalled();
    expect(getElement(devices[0], dataTestIds.statusLoading)).toBeInTheDocument();
  });

  it('shows the location when the device is already commissioned', () => {
    const deviceWithLocation = mockDevices[1];
    const { getElement } = renderCommissionDevices({ devices: [deviceWithLocation] });

    expect(getElement(deviceWithLocation, dataTestIds.tableCellDeviceLocation)).toHaveTextContent(
      'sites/SSF2/areas/Seeding/lines/TraySeeding/deviceLocations/Camera'
    );
    expect(getElement(deviceWithLocation, dataTestIds.validDeviceLocation)).not.toBeInTheDocument();
    expect(getElement(deviceWithLocation, dataTestIds.statusComplete)).toBeInTheDocument();
  });

  it('clears the status and errors when selecting something else than a device location', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError({ status: 404 }));
    mockUseGetRequest.mockReturnValue({ makeRequest });

    const { queryByTestId, getElement, expectNoStatus } = renderCommissionDevices({ devices });

    expectNoStatus(devices[0]);
    expect(queryByTestId(dataTestIds.commissionDevices)).toBeDisabled();
    expect(queryByTestId(dataTestIds.commissionDevices)).toHaveTextContent('Commission Devices (0)');

    // -> selects a device location
    await actAndAwait(() => getElement(devices[0], dataTestIds.validDeviceLocation).click());

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(queryByTestId(dataTestIds.commissionDevices)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.commissionDevices)).toHaveTextContent('Commission Devices (1)');
    expect(getElement(devices[0], dataTestIds.statusAvailable)).toBeInTheDocument();

    // -> selects something else than a device location
    await actAndAwait(() => getElement(devices[0], dataTestIds.invalidDeviceLocation).click());

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expectNoStatus(devices[0]);
    expect(queryByTestId(dataTestIds.commissionDevices)).toBeDisabled();
    expect(queryByTestId(dataTestIds.commissionDevices)).toHaveTextContent('Commission Devices (0)');
  });

  it('commissions devices', async () => {
    const device1WithLocation = { ...devices[0], location: mockDevices[1].location };
    const device1 = devices[0];
    const device2 = devices[1];

    const makeRequest1 = jest.fn().mockImplementation(({ onError }) => onError({ status: 404 }));
    mockUseGetRequest.mockReturnValue({ makeRequest: makeRequest1 });
    const makeRequest2 = jest.fn().mockImplementation(({ onSuccess }) => onSuccess(device1WithLocation));
    mockUsePostRequest.mockReturnValue({ makeRequest: makeRequest2 });

    const { queryByTestId, getElement } = renderCommissionDevices({ devices: [device1, device2] });

    expect(getElement(device1, dataTestIds.validDeviceLocation)).toBeInTheDocument();
    expect(getElement(device2, dataTestIds.validDeviceLocation)).toBeInTheDocument();
    expect(getElement(device1, dataTestIds.statusLoading)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.commissionDevices)).toBeDisabled();
    expect(queryByTestId(dataTestIds.commissionDevices)).toHaveTextContent('Commission Devices (0)');

    await actAndAwait(() => getElement(device1, dataTestIds.validDeviceLocation).click());

    expect(makeRequest1).toHaveBeenCalledTimes(1);
    expect(queryByTestId(dataTestIds.commissionDevices)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.commissionDevices)).toHaveTextContent('Commission Devices (1)');

    await actAndAwait(() => queryByTestId(dataTestIds.commissionDevices).click());

    expect(makeRequest2).toHaveBeenCalledTimes(1);

    expect(getElement(device1, dataTestIds.tableCellDeviceLocation)).toHaveTextContent(
      'sites/SSF2/areas/Seeding/lines/TraySeeding/deviceLocations/Camera'
    );
    expect(getElement(device1, dataTestIds.validDeviceLocation)).not.toBeInTheDocument();
    expect(getElement(device1, dataTestIds.statusComplete)).toBeInTheDocument();
    expect(getElement(device2, dataTestIds.validDeviceLocation)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.commissionDevices)).toBeDisabled();
    expect(queryByTestId(dataTestIds.commissionDevices)).toHaveTextContent('Commission Devices (0)');
  });
});
