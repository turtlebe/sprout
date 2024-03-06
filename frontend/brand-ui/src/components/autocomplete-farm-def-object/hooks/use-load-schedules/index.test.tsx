import { useSwrAxios } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { buildSchedule, mockScheduleDefinitions } from '@plentyag/core/src/test-helpers/mocks';
import { toQueryParams } from '@plentyag/core/src/utils';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAutocompleteFarmDefObjectStore } from '../';
import { root } from '../../test-helpers';

import { useLoadSchedules } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const id = 'mock-id';
const [scheduleDefinition] = mockScheduleDefinitions;

describe('useLoadSchedules', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    act(() => result.current[1].resetStore());
  });

  it('does not load schedules when resolveSchedule is false', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: undefined });

    const { result: resultStore } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    const [store, actions] = resultStore.current;

    act(() => actions.setSelectedFarmDefObject(scheduleDefinition));

    renderHook(() => useLoadSchedules(id, false));

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
    expect(mockUseSwrAxios).toHaveBeenNthCalledWith(1, { url: false });
    expect(store.isOpen).toBe(false);
    expect(store.farmDefObjects).toEqual([]);
    expect(store.scheduleIds).toEqual(new Set());
  });

  it('does not load schedules when the selected object is not a schedule definition', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: undefined });

    const { result: resultStore } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    const [store, actions] = resultStore.current;

    act(() => actions.setSelectedFarmDefObject(root.sites['SSF2']));

    renderHook(() => useLoadSchedules(id, true));

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
    expect(mockUseSwrAxios).toHaveBeenNthCalledWith(1, { url: undefined });
    expect(store.isOpen).toBe(false);
    expect(store.farmDefObjects).toEqual([]);
    expect(store.scheduleIds).toEqual(new Set());
  });

  it('loads schedules but does not do anything when no schedule exists', () => {
    mockUseSwrAxios.mockReturnValue({ data: buildPaginatedResponse([]), isValidating: false, error: undefined });

    const { result: resultStore } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    const [, actions] = resultStore.current;

    act(() => actions.setSelectedFarmDefObject(scheduleDefinition));

    renderHook(() => useLoadSchedules(id, true));

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(2);
    expect(mockUseSwrAxios).toHaveBeenNthCalledWith(1, {
      url: expect.stringContaining(toQueryParams({ path: scheduleDefinition.path })),
    });
    expect(resultStore.current[0].isOpen).toBe(false);
    expect(resultStore.current[0].farmDefObjects).toEqual([]);
    expect(resultStore.current[0].scheduleIds).toEqual(new Set());
  });

  it('loads schedules and auto set the selected state to the schedule when only one exists', () => {
    const schedule = buildSchedule({ path: scheduleDefinition.path });
    mockUseSwrAxios.mockReturnValue({
      data: buildPaginatedResponse([schedule]),
      isValidating: false,
      error: undefined,
    });

    const { result: resultStore } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    const [, actions] = resultStore.current;

    act(() => actions.setSelectedFarmDefObject(scheduleDefinition));

    renderHook(() => useLoadSchedules(id, true));

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(2);
    expect(mockUseSwrAxios).toHaveBeenNthCalledWith(1, {
      url: expect.stringContaining(toQueryParams({ path: scheduleDefinition.path })),
    });
    expect(resultStore.current[0].isOpen).toBe(false);
    expect(resultStore.current[0].farmDefObjects).toEqual([schedule]);
    expect(resultStore.current[0].scheduleIds).toEqual(new Set([schedule.id]));
    expect(resultStore.current[0].selectedFarmDefObject).toEqual(schedule);
  });

  it('loads schedules in the store when there are more than 2 schedules for the same path', () => {
    const schedules = [
      buildSchedule({ path: scheduleDefinition.path, priority: 1 }),
      buildSchedule({ path: scheduleDefinition.path, priority: 2 }),
    ];
    mockUseSwrAxios.mockReturnValue({
      data: buildPaginatedResponse(schedules),
      isValidating: false,
      error: undefined,
    });

    const { result: resultStore } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    const [, actions] = resultStore.current;

    act(() => actions.setSelectedFarmDefObject(scheduleDefinition));

    renderHook(() => useLoadSchedules(id, true));

    expect(mockUseSwrAxios).toHaveBeenCalledTimes(2);
    expect(mockUseSwrAxios).toHaveBeenNthCalledWith(1, {
      url: expect.stringContaining(toQueryParams({ path: scheduleDefinition.path })),
    });
    expect(resultStore.current[0].isOpen).toBe(true);
    expect(resultStore.current[0].farmDefObjects).toEqual(schedules);
    expect(resultStore.current[0].scheduleIds).toEqual(new Set(schedules.map(schedule => schedule.id)));
    expect(resultStore.current[0].selectedFarmDefObject).toEqual(scheduleDefinition);
  });
});
