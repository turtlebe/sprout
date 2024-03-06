import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { buildAlertRule, buildMetric, buildSchedule, buildScheduleDefinition } from '../../test-helpers';
import { convertUnitForMetric, convertUnitForSchedule } from '../../utils';
import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '../use-local-storage-units-preferences/test-helpers';
import { useScheduleDefinitionContext } from '../use-schedule-definition-context';

import { useConverter } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-schedule-definition-context');

const mockUseScheduleDefinitionContext = useScheduleDefinitionContext as jest.Mock;
const fetchScheduleDefinition = jest.fn();
const conversionFn = values => (values * 9) / 5 + 32;

describe('useConverter', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();

    jest.resetAllMocks();

    mockUseFetchMeasurementTypes();

    mockUseScheduleDefinitionContext.mockReturnValue({
      scheduleDefinitions: {},
      loadingStatuses: {},
      fetchScheduleDefinition,
    });
  });

  it('returns a single metric without conversion', () => {
    const metric = buildMetric({ alertRules: [buildAlertRule({})] });

    const { result } = renderHook(() => useConverter({ metric }));

    expect(result.current.metric).toEqual(metric);
    expect(result.current.metrics).toBe(undefined);
    expect(result.current.schedule).toBe(undefined);
    expect(result.current.schedules).toBe(undefined);
    expect(result.current.scheduleDefinition).toBe(undefined);
    expect(result.current.scheduleDefinitions).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(fetchScheduleDefinition).not.toHaveBeenCalled();
  });

  it('converts a single metric', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const metric = buildMetric({ alertRules: [buildAlertRule({})] });
    const conversionFn = values => (values * 9) / 5 + 32;

    const { result } = renderHook(() => useConverter({ metric }));

    expect(result.current.metric).not.toEqual(metric);
    expect(result.current.metric).toEqual(convertUnitForMetric(conversionFn)(metric));

    expect(result.current.metrics).toBe(undefined);
    expect(result.current.schedule).toBe(undefined);
    expect(result.current.schedules).toBe(undefined);
    expect(result.current.scheduleDefinition).toBe(undefined);
    expect(result.current.scheduleDefinitions).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(fetchScheduleDefinition).not.toHaveBeenCalled();
  });

  it('converts multiple metrics', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const metrics = [
      buildMetric({ alertRules: [buildAlertRule({})] }),
      buildMetric({ alertRules: [buildAlertRule({})] }),
    ];

    const { result } = renderHook(() => useConverter({ metrics }));

    expect(result.current.metrics).toEqual(metrics.map(metric => convertUnitForMetric(conversionFn)(metric)));
    expect(result.current.metrics).not.toEqual(metrics);

    expect(result.current.metric).toBe(undefined);
    expect(result.current.schedule).toBe(undefined);
    expect(result.current.schedules).toBe(undefined);
    expect(result.current.scheduleDefinition).toBe(undefined);
    expect(result.current.scheduleDefinitions).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(fetchScheduleDefinition).not.toHaveBeenCalled();
  });

  it('converts a single schedule', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const schedule = buildSchedule({
      actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '15', zone2: '18' } }],
    });
    const scheduleDefinition = buildScheduleDefinition({
      actionDefinitions: {
        zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
      },
    });
    mockUseScheduleDefinitionContext.mockReturnValue({
      scheduleDefinitions: { [schedule.path]: scheduleDefinition },
      loadingStatuses: { [schedule.path]: false },
      fetchScheduleDefinition,
    });

    const { result } = renderHook(() => useConverter({ schedule }));

    expect(result.current.schedule).not.toEqual(schedule);
    expect(result.current.schedule).toEqual(convertUnitForSchedule(conversionFn)(schedule, scheduleDefinition));
    expect(result.current.scheduleDefinition).toEqual(scheduleDefinition);
    expect(fetchScheduleDefinition).toHaveBeenCalledTimes(1);
    expect(fetchScheduleDefinition).toHaveBeenCalledWith(schedule.path);

    expect(result.current.metrics).toBe(undefined);
    expect(result.current.metrics).toBe(undefined);
    expect(result.current.metric).toBe(undefined);
    expect(result.current.schedules).toBe(undefined);
    expect(result.current.scheduleDefinitions).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns a loading flag when fetching the schedule definition of a single schedule', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const schedule = buildSchedule({
      actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '15', zone2: '18' } }],
    });
    mockUseScheduleDefinitionContext.mockReturnValue({
      scheduleDefinitions: {},
      loadingStatuses: { [schedule.path]: true },
      fetchScheduleDefinition,
    });

    const { result } = renderHook(() => useConverter({ schedule }));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.schedule).toEqual(schedule);
    expect(fetchScheduleDefinition).toHaveBeenCalledTimes(1);
    expect(fetchScheduleDefinition).toHaveBeenCalledWith(schedule.path);

    expect(result.current.metrics).toBe(undefined);
    expect(result.current.metrics).toBe(undefined);
    expect(result.current.metric).toBe(undefined);
    expect(result.current.schedules).toBe(undefined);
    expect(result.current.scheduleDefinition).toBe(undefined);
    expect(result.current.scheduleDefinitions).toBe(undefined);
  });

  describe('with multiple schedules', () => {
    const schedules = [
      buildSchedule({
        path: 'sites/LAX1/scheduleDefinitions/SetTemperature',
        actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '15', zone2: '18' } }],
      }),
      buildSchedule({
        path: 'sites/SSF2/scheduleDefinitions/SetTemperature',
        actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { zone1: '15', zone2: '18' } }],
      }),
    ];
    const scheduleDefinitions = [
      buildScheduleDefinition({
        path: schedules[0].path,
        actionDefinitions: {
          zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
          zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        },
      }),
      buildScheduleDefinition({
        path: schedules[1].path,
        actionDefinitions: {
          zone1: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
          zone2: { oneOf: ['10', '20'], measurementType: 'TEMPERATURE', graphable: true },
        },
      }),
    ];

    it('converts multiple schedules', () => {
      setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

      mockUseScheduleDefinitionContext.mockReturnValue({
        scheduleDefinitions: {
          [schedules[0].path]: scheduleDefinitions[0],
          [schedules[1].path]: scheduleDefinitions[1],
        },
        loadingStatuses: { [schedules[0].path]: false, [schedules[1].path]: false },
        fetchScheduleDefinition,
      });

      const { result } = renderHook(() => useConverter({ schedules }));

      expect(result.current.schedules).not.toEqual(schedules);
      expect(result.current.schedules).toEqual(
        schedules.map((schedule, index) => convertUnitForSchedule(conversionFn)(schedule, scheduleDefinitions[index]))
      );
      expect(result.current.scheduleDefinitions).toEqual(scheduleDefinitions);
      expect(fetchScheduleDefinition).toHaveBeenCalledTimes(2);
      expect(fetchScheduleDefinition).toHaveBeenCalledWith(schedules[0].path);
      expect(fetchScheduleDefinition).toHaveBeenCalledWith(schedules[1].path);

      expect(result.current.metrics).toBe(undefined);
      expect(result.current.metrics).toBe(undefined);
      expect(result.current.metric).toBe(undefined);
      expect(result.current.schedule).toBe(undefined);
      expect(result.current.scheduleDefinition).toBe(undefined);
      expect(result.current.isLoading).toBe(false);
    });

    it('returns a loading flag when one of the schedule definitions is loading', () => {
      setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

      mockUseScheduleDefinitionContext.mockReturnValue({
        scheduleDefinitions: {},
        loadingStatuses: { [schedules[0].path]: true, [schedules[1].path]: true },
        fetchScheduleDefinition,
      });

      const { result } = renderHook(() => useConverter({ schedules }));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.schedules).toEqual(schedules);
      expect(fetchScheduleDefinition).toHaveBeenCalledTimes(2);
      expect(fetchScheduleDefinition).toHaveBeenCalledWith(schedules[0].path);
      expect(fetchScheduleDefinition).toHaveBeenCalledWith(schedules[1].path);

      expect(result.current.metrics).toBe(undefined);
      expect(result.current.metrics).toBe(undefined);
      expect(result.current.metric).toBe(undefined);
      expect(result.current.schedule).toBe(undefined);
      expect(result.current.scheduleDefinition).toBe(undefined);
      expect(result.current.scheduleDefinitions).toEqual([]);
    });
  });
});
