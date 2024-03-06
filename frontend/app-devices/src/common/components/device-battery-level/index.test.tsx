import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';

import { DeviceTypes } from '../../types/device-types';

import { dataTestIdsDeviceBatteryLevel, DeviceBatteryLevel } from '.';

import {
  emptyBatteryObservation,
  fullBatteryObservation,
  highBatteryObservation,
  lowBatteryObservation,
  mediumBatteryObservation,
  sprinkle1EmptyBatteryObservation,
  sprinkle1FullBatteryObservation,
  sprinkle1HighBatteryObservation,
  sprinkle1LowBatteryObservation,
  sprinkle1MediumBatteryObservation,
} from './test-mocks';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const sprinkle1 = mockDevices.find(device => device.deviceTypeName === DeviceTypes.Sprinkle);
const sprinkle2 = mockDevices.find(device => device.deviceTypeName === DeviceTypes.Sprinkle2FIR);
const hathor = mockDevices.find(device => device.deviceTypeName === DeviceTypes.Hathor);

function renderDeviceBatteryLevel({ device, observations = [], isValidating = false }) {
  mockUseSwrAxios.mockReturnValue({ data: { data: observations }, isValidating });

  return render(<DeviceBatteryLevel device={device} />);
}

describe('DeviceBatteryLevel', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when the device is undefined', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { container } = render(<DeviceBatteryLevel device={undefined} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the device is not a sprinkle 1 or 2', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { container } = render(<DeviceBatteryLevel device={hathor} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('posts a request with correct body data', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    render(<DeviceBatteryLevel device={sprinkle2} />);

    const oneHourAgoInHoursAndMinutes = DateTime.now().toUTC().minus({ hour: 1 }).toFormat('HH:mm');

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          deviceId: sprinkle2.id,
          observationName: 'BatteryVoltage',
          startDateTime: expect.stringContaining(oneHourAgoInHoursAndMinutes),
          limit: 1,
        },
      }),
      expect.anything()
    );
  });

  it('renders a loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId } = render(<DeviceBatteryLevel device={sprinkle2} />);

    expect(queryByTestId(dataTestIdsDeviceBatteryLevel.loading)).toBeInTheDocument();
  });

  it('renders an unknown state when no observations are present', () => {
    const { queryByTestId } = renderDeviceBatteryLevel({ device: sprinkle2 });

    expect(queryByTestId(dataTestIdsDeviceBatteryLevel.unknown)).toBeInTheDocument();
  });

  it('renders an icon for a device with an empty battery', () => {
    const { queryByTestId } = renderDeviceBatteryLevel({ device: sprinkle2, observations: [emptyBatteryObservation] });

    expect(queryByTestId(dataTestIdsDeviceBatteryLevel.empty)).toBeInTheDocument();
  });

  it('renders an icon for a device with low level battery', () => {
    const { queryByTestId } = renderDeviceBatteryLevel({ device: sprinkle2, observations: [lowBatteryObservation] });

    expect(queryByTestId(dataTestIdsDeviceBatteryLevel.low)).toBeInTheDocument();
  });

  it('renders an icon for a device with medium level battery', () => {
    const { queryByTestId } = renderDeviceBatteryLevel({ device: sprinkle2, observations: [mediumBatteryObservation] });

    expect(queryByTestId(dataTestIdsDeviceBatteryLevel.medium)).toBeInTheDocument();
  });

  it('renders an icon for a device with high level battery', () => {
    const { queryByTestId } = renderDeviceBatteryLevel({ device: sprinkle2, observations: [highBatteryObservation] });

    expect(queryByTestId(dataTestIdsDeviceBatteryLevel.high)).toBeInTheDocument();
  });

  it('renders an icon for a device with full level battery', () => {
    const { queryByTestId } = renderDeviceBatteryLevel({ device: sprinkle2, observations: [fullBatteryObservation] });

    expect(queryByTestId(dataTestIdsDeviceBatteryLevel.full)).toBeInTheDocument();
  });

  describe('for sprinkles v1', () => {
    it('renders an unknown state when no observations are present', () => {
      const { queryByTestId } = renderDeviceBatteryLevel({ device: sprinkle1 });

      expect(queryByTestId(dataTestIdsDeviceBatteryLevel.unknown)).toBeInTheDocument();
    });

    it('renders an icon for a device with an empty battery', () => {
      const { queryByTestId } = renderDeviceBatteryLevel({
        device: sprinkle1,
        observations: [sprinkle1EmptyBatteryObservation],
      });

      expect(queryByTestId(dataTestIdsDeviceBatteryLevel.empty)).toBeInTheDocument();
    });

    it('renders an icon for a device with low level battery', () => {
      const { queryByTestId } = renderDeviceBatteryLevel({
        device: sprinkle1,
        observations: [sprinkle1LowBatteryObservation],
      });

      expect(queryByTestId(dataTestIdsDeviceBatteryLevel.low)).toBeInTheDocument();
    });

    it('renders an icon for a device with medium level battery', () => {
      const { queryByTestId } = renderDeviceBatteryLevel({
        device: sprinkle1,
        observations: [sprinkle1MediumBatteryObservation],
      });

      expect(queryByTestId(dataTestIdsDeviceBatteryLevel.medium)).toBeInTheDocument();
    });

    it('renders an icon for a device with high level battery', () => {
      const { queryByTestId } = renderDeviceBatteryLevel({
        device: sprinkle1,
        observations: [sprinkle1HighBatteryObservation],
      });

      expect(queryByTestId(dataTestIdsDeviceBatteryLevel.high)).toBeInTheDocument();
    });

    it('renders an icon for a device with full level battery', () => {
      const { queryByTestId } = renderDeviceBatteryLevel({
        device: sprinkle1,
        observations: [sprinkle1FullBatteryObservation],
      });

      expect(queryByTestId(dataTestIdsDeviceBatteryLevel.full)).toBeInTheDocument();
    });
  });
});
