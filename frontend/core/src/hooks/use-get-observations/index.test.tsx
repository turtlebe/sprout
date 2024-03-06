import { mockDevices } from '@plentyag/app-devices/src/common/test-helpers/devices';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';
import { DateTime } from 'luxon';

import { useGetObservations } from '.';

const placedHathor = mockDevices.find(device => device.deviceTypeName === 'Hathor' && device.location);

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useGetObservations', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches data and memoize a time window', () => {
    jest.useFakeTimers();

    const now = '2022-06-03T20:00:00.000Z';
    const nowMinusOneHour = '2022-06-03T19:00:00.000Z';
    jest.setSystemTime(new Date(now));

    const { rerender } = renderHook(
      ({ device }) => useGetObservations({ device, observationName: 'MockObservationName', amount: -1, unit: 'hours' }),
      { initialProps: { device: placedHathor } }
    );

    expect(mockUseSwrAxios).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.any(String),
        data: expect.objectContaining({
          observationName: 'MockObservationName',
          deviceId: placedHathor.id,
          startDateTime: nowMinusOneHour,
          endDateTime: now,
          limit: 1,
        }),
      }),
      { shouldRetryOnError: false }
    );

    rerender({ device: placedHathor });

    expect(mockUseSwrAxios).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.any(String),
        data: expect.objectContaining({
          observationName: 'MockObservationName',
          deviceId: placedHathor.id,
          startDateTime: nowMinusOneHour,
          endDateTime: now,
          limit: 1,
        }),
      }),
      { shouldRetryOnError: false }
    );

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(2);
  });

  it('fetches data and not memoize a time window', () => {
    let now = DateTime.now().toUTC().toISO();

    const { rerender } = renderHook(
      ({ device, from }) =>
        useGetObservations({ device, observationName: 'MockObservationName', amount: -1, unit: 'hours', from }),
      { initialProps: { device: placedHathor, from: now } }
    );

    expect(mockUseSwrAxios).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.any(String),
        data: expect.objectContaining({
          observationName: 'MockObservationName',
          deviceId: placedHathor.id,
          startDateTime: expect.any(String),
          endDateTime: now,
          limit: 1,
        }),
      }),
      { shouldRetryOnError: false }
    );
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);

    now = DateTime.now().toUTC().toISO();
    rerender({ device: placedHathor, from: now });

    expect(mockUseSwrAxios).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.any(String),
        data: expect.objectContaining({
          observationName: 'MockObservationName',
          deviceId: placedHathor.id,
          startDateTime: expect.any(String),
          endDateTime: now,
          limit: 1,
        }),
      }),
      { shouldRetryOnError: false }
    );

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(2);
  });
});
