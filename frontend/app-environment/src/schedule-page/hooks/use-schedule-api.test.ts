import { useFetchAndConvertScheduleWithDefinition } from '@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-schedule-with-definition';
import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { mockScheduleDefinitions, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { mockGlobalSnackbar, successSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { Schedule } from '@plentyag/core/src/types/environment';
import { act, renderHook } from '@testing-library/react-hooks';

import { useScheduleApi } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-schedule-with-definition');
jest.mock('@plentyag/core/src/hooks/use-axios');

mockCurrentUser();
mockGlobalSnackbar();
mockUseFetchMeasurementTypes();

const mockUseFetchAndConvertScheduleWithDefinition = useFetchAndConvertScheduleWithDefinition as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;

const makeRequest = jest.fn();
const revalidate = jest.fn();
const onSuccess = jest.fn();

const [schedule] = mockSchedules;
const scheduleDefinition = mockScheduleDefinitions.find(
  definition => definition.action.measurementType === 'TEMPERATURE'
);
const newSchedule: Schedule = {
  ...schedule,
  actions: [
    { time: 0, value: '10', valueType: 'SINGLE_VALUE' },
    { time: 3600, value: '20', valueType: 'SINGLE_VALUE' },
  ],
};
const newScheduleInFahrenheit: Schedule = {
  ...schedule,
  actions: [
    { time: 0, value: '50', valueType: 'SINGLE_VALUE' },
    { time: 3600, value: '68', valueType: 'SINGLE_VALUE' },
  ],
};
const scheduleId = schedule.id;

describe('useScheduleApi', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    mockUseFetchAndConvertScheduleWithDefinition.mockRestore();
    mockUsePutRequest.mockRestore();
    makeRequest.mockRestore();
    revalidate.mockRestore();
    onSuccess.mockRestore();
  });

  it('returns the loading state when fetching', () => {
    mockUseFetchAndConvertScheduleWithDefinition.mockReturnValue({
      schedule: undefined,
      scheduleDefinition: undefined,
      isLoading: true,
      revalidate,
    });
    mockUsePutRequest.mockReturnValue({ makeRequest });

    const { result } = renderHook(() => useScheduleApi({ scheduleId }));

    expect(result.current.schedule).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isUpdating).toBe(false);
  });

  it('returns the loading state when reloading the schedule', async () => {
    mockUseFetchAndConvertScheduleWithDefinition.mockReturnValue({
      schedule,
      scheduleDefinition,
      isLoading: false,
      revalidate,
    });
    mockUsePutRequest.mockReturnValue({ makeRequest });

    const { result, rerender } = renderHook(() => useScheduleApi({ scheduleId }));

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdating).toBe(false);

    mockUseFetchAndConvertScheduleWithDefinition.mockReturnValue({
      schedule,
      scheduleDefinition,
      isLoading: true,
      revalidate,
    });

    await actAndAwait(() => result.current.revalidateSchedule());

    rerender({ scheduleId });

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isUpdating).toBe(false);
    expect(revalidate).toHaveBeenCalled();
  });

  it('updates the schedule locally, then resets it', () => {
    mockUseFetchAndConvertScheduleWithDefinition.mockReturnValue({
      schedule,
      scheduleDefinition,
      isLoading: false,
      revalidate,
    });
    mockUsePutRequest.mockReturnValue({ makeRequest });

    const { result } = renderHook(() => useScheduleApi({ scheduleId }));

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdating).toBe(false);

    act(() => result.current.updateSchedule(newSchedule));

    expect(result.current.schedule).toEqual(newSchedule);

    act(() => result.current.resetSchedule());

    expect(result.current.schedule).toEqual(schedule);
  });

  it('persists the schedule and sort the actions to the backend', () => {
    const updatedSchedule = {
      ...newSchedule,
      actions: [newSchedule.actions[1], newSchedule.actions[0]],
      updatedBy: 'olittle',
    };
    const updatedAndSortedSchedule = { ...newSchedule, updatedBy: 'olittle' };
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess(updatedAndSortedSchedule, {}));
    mockUseFetchAndConvertScheduleWithDefinition.mockReturnValue({
      schedule,
      scheduleDefinition,
      isLoading: false,
      revalidate,
    });
    mockUsePutRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { result } = renderHook(() => useScheduleApi({ scheduleId }));

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.schedule.createdBy).not.toBe('olittle');
    expect(result.current.schedule.updatedBy).not.toBe('olittle');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdating).toBe(false);

    act(() => result.current.updateSchedule(updatedSchedule));

    expect(result.current.schedule).toEqual(updatedSchedule);

    act(() => result.current.persistSchedule({ onSuccess }));

    expect(successSnackbar).toHaveBeenCalled();
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining(updatedAndSortedSchedule) })
    );
    expect(result.current.schedule).toEqual(updatedAndSortedSchedule);

    act(() => result.current.resetSchedule());

    expect(result.current.schedule).toEqual(updatedAndSortedSchedule);
  });

  it('persists the schedule using the default unit to the backend', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
    const updatedSchedule = { ...newSchedule, updatedBy: 'olittle' };
    const updatedScheduleInFahrenheit = { ...newScheduleInFahrenheit, updatedBy: 'olittle' };
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess(updatedSchedule, {}));
    mockUseFetchAndConvertScheduleWithDefinition.mockReturnValue({
      schedule,
      scheduleDefinition,
      isLoading: false,
      revalidate,
    });
    mockUsePutRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { result } = renderHook(() => useScheduleApi({ scheduleId }));

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.schedule.createdBy).not.toBe('olittle');
    expect(result.current.schedule.updatedBy).not.toBe('olittle');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isUpdating).toBe(false);

    act(() => result.current.updateSchedule(newScheduleInFahrenheit));

    expect(result.current.schedule).toEqual(newScheduleInFahrenheit);

    act(() => result.current.persistSchedule({ onSuccess }));

    expect(successSnackbar).toHaveBeenCalled();
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining(updatedSchedule) })
    );
    expect(result.current.schedule).toEqual(updatedScheduleInFahrenheit);
    expect(result.current.isUpdating).toBe(false);

    act(() => result.current.resetSchedule());

    expect(result.current.schedule).toEqual(updatedScheduleInFahrenheit);
  });

  it('sets the flag isUpdating to true while updating', () => {
    mockUseFetchAndConvertScheduleWithDefinition.mockReturnValue({
      schedule,
      scheduleDefinition,
      isLoading: false,
      revalidate,
    });
    mockUsePutRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { result } = renderHook(() => useScheduleApi({ scheduleId }));

    expect(result.current.isUpdating).toBe(false);

    act(() => result.current.updateSchedule(newSchedule));
    act(() => result.current.persistSchedule({ onSuccess }));

    expect(result.current.isUpdating).toBe(true);
  });
});
