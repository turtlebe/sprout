import { useFetchScheduleDefinition } from '@plentyag/app-environment/src/common/hooks/use-fetch-schedule-definition';
import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { mockMetrics, mockScheduleDefinitions, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { EVS_URLS } from '../utils';

import { useFetchAndConvertScheduleWithDefinition } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-schedule-definition');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseFetchScheduleDefinition = useFetchScheduleDefinition as jest.Mock;

const [metric] = mockMetrics;
const [schedule] = mockSchedules;
const scheduleDefinition = mockScheduleDefinitions.find(
  scheduleDefinition => scheduleDefinition.action.measurementType === 'TEMPERATURE'
);

mockUseFetchMeasurementTypes();

describe('useFetchAndConvertScheduleWithDefinition', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    mockUseSwrAxios.mockRestore();
    mockUseFetchScheduleDefinition.mockRestore();
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinition);
  });

  it('returns nothing when not passing a scheduleId or Metric', () => {
    const scheduleResponse = { data: undefined, isValidating: false, error: undefined };
    const scheduleDefinitionResponse = { data: undefined, isValidating: false, error: undefined };

    mockUseSwrAxios.mockReturnValue(scheduleResponse);
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinitionResponse);

    const { result } = renderHook(() => useFetchAndConvertScheduleWithDefinition({}));

    expect(result.current.schedule).toBeUndefined();
    expect(result.current.scheduleDefinition).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('fetches the related Schedule and its definition when passing a Metric', () => {
    const scheduleResponse = { data: schedule, isValidating: false, error: undefined };
    const scheduleDefinitionResponse = { data: scheduleDefinition, isValidating: false, error: undefined };

    mockUseSwrAxios.mockReturnValue(scheduleResponse);
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinitionResponse);

    const { result } = renderHook(() => useFetchAndConvertScheduleWithDefinition({ metric }));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: EVS_URLS.schedules.relatedScheduleUrl(metric),
    });

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.scheduleDefinition).toEqual(scheduleDefinition);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns the swrAxios response without converting the data', () => {
    const scheduleResponse = { data: schedule, isValidating: false, error: undefined };
    const scheduleDefinitionResponse = { data: scheduleDefinition, isValidating: false, error: undefined };

    mockUseSwrAxios.mockReturnValue(scheduleResponse);
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinitionResponse);

    const { result } = renderHook(() => useFetchAndConvertScheduleWithDefinition({ scheduleId: schedule.id }));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: EVS_URLS.schedules.getByIdUrl(schedule.id),
    });

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.scheduleDefinition).toEqual(scheduleDefinition);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns as loading when the schedule is loading', () => {
    const scheduleResponse = { data: undefined, isValidating: true, error: undefined };
    const scheduleDefinitionResponse = { data: scheduleDefinition, isValidating: false, error: undefined };

    mockUseSwrAxios.mockReturnValue(scheduleResponse);
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinitionResponse);

    const { result } = renderHook(() => useFetchAndConvertScheduleWithDefinition({ scheduleId: schedule.id }));

    expect(result.current.schedule).toBeUndefined();
    expect(result.current.scheduleDefinition).toEqual(scheduleDefinition);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns as loading when the definition is loading', () => {
    const scheduleResponse = { data: schedule, isValidating: false, error: undefined };
    const scheduleDefinitionResponse = { data: undefined, isValidating: true, error: undefined };

    mockUseSwrAxios.mockReturnValue(scheduleResponse);
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinitionResponse);

    const { result } = renderHook(() => useFetchAndConvertScheduleWithDefinition({ scheduleId: schedule.id }));

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.scheduleDefinition).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('returns the swrAxios response without converting the data when there is not preferred unit', () => {
    const scheduleResponse = { data: schedule, isValidating: false, error: undefined };
    const scheduleDefinitionResponse = { data: scheduleDefinition, isValidating: false, error: undefined };

    mockUseSwrAxios.mockReturnValue(scheduleResponse);
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinitionResponse);

    const { result } = renderHook(() => useFetchAndConvertScheduleWithDefinition({ scheduleId: schedule.id }));

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.scheduleDefinition).toEqual(scheduleDefinition);
    expect(result.current.schedule.actions[0].value).toBe('100');
  });

  it('returns the swrAxios response without converting the data when the preferred unit is the default unit', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'C' });
    const scheduleResponse = { data: schedule, isValidating: false, error: undefined };
    const scheduleDefinitionResponse = { data: scheduleDefinition, isValidating: false, error: undefined };

    mockUseSwrAxios.mockReturnValue(scheduleResponse);
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinitionResponse);

    const { result } = renderHook(() => useFetchAndConvertScheduleWithDefinition({ scheduleId: schedule.id }));

    expect(result.current.schedule).toEqual(schedule);
    expect(result.current.scheduleDefinition).toEqual(scheduleDefinition);
    expect(result.current.schedule.actions[0].value).toBe('100');
  });

  it('returns the swrAxios response and convert everything to the preferred unit', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
    const scheduleResponse = { data: schedule, isValidating: false, error: undefined };
    const scheduleDefinitionResponse = { data: scheduleDefinition, isValidating: false, error: undefined };

    mockUseSwrAxios.mockReturnValue(scheduleResponse);
    mockUseFetchScheduleDefinition.mockReturnValue(scheduleDefinitionResponse);

    const { result } = renderHook(() => useFetchAndConvertScheduleWithDefinition({ scheduleId: schedule.id }));

    expect(result.current.schedule).not.toEqual(schedule);
    expect(result.current.schedule.actions[0].value).toBe('212');
  });
});
