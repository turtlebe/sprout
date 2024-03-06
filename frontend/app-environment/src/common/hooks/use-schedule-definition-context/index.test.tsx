import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils';
import { act, renderHook } from '@testing-library/react-hooks';

import { buildScheduleDefinition } from '../../test-helpers';
import { getScheduleDefinitionUrl } from '../../utils/api-urls';

import { ScheduleDefinitionContextProvider, useScheduleDefinitionContext } from '.';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;
const path = 'sites/LAX1/scheduleDefinitions/SetTemperature';
const actionDefinition = { from: 0, to: 100, measurementType: 'TEMPERATURE', graphable: true };
const scheduleDefinition = buildScheduleDefinition({ path, actionDefinition });

describe('useScheduleDefinitionContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns an initial context', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useScheduleDefinitionContext());

    expect(result.current.scheduleDefinitions).toEqual({});
    expect(result.current.loadingStatuses).toEqual({});
    expect(result.current.fetchScheduleDefinition).toBeDefined();

    expect(consoleWarn).not.toHaveBeenCalled();

    act(() => result.current.fetchScheduleDefinition(path));

    expect(consoleWarn).toHaveBeenCalled();
  });

  it('loads a schedule definition', async () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockAxiosRequest.mockResolvedValue({ data: scheduleDefinition });

    const { result } = renderHook(() => useScheduleDefinitionContext(), {
      wrapper: ScheduleDefinitionContextProvider,
    });

    expect(result.current.scheduleDefinitions).toEqual({});
    expect(result.current.loadingStatuses).toEqual({});
    expect(consoleWarn).not.toHaveBeenCalled();
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    await actAndAwaitForHook(() => result.current.fetchScheduleDefinition(path));

    expect(result.current.scheduleDefinitions).toEqual({ [path]: scheduleDefinition });
    expect(result.current.loadingStatuses).toEqual({ [path]: false });
    expect(consoleWarn).not.toHaveBeenCalled();
    expect(mockAxiosRequest).toHaveBeenCalledWith({ url: getScheduleDefinitionUrl(path) });
  });

  it("doesn't load the definition when the path is invalid", async () => {
    mockAxiosRequest.mockResolvedValue({ data: scheduleDefinition });

    const { result } = renderHook(() => useScheduleDefinitionContext(), {
      wrapper: ScheduleDefinitionContextProvider,
    });

    expect(result.current.scheduleDefinitions).toEqual({});
    expect(result.current.loadingStatuses).toEqual({});
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    await actAndAwaitForHook(() => result.current.fetchScheduleDefinition(undefined));

    expect(result.current.scheduleDefinitions).toEqual({});
    expect(result.current.loadingStatuses).toEqual({});
    expect(mockAxiosRequest).not.toHaveBeenCalled();
  });

  it("doesn't load the definition when definition is already resolved", async () => {
    mockAxiosRequest.mockResolvedValue({ data: scheduleDefinition });

    const { result } = renderHook(() => useScheduleDefinitionContext(), {
      wrapper: ScheduleDefinitionContextProvider,
    });

    expect(result.current.scheduleDefinitions).toEqual({});
    expect(result.current.loadingStatuses).toEqual({});
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    await actAndAwaitForHook(() => result.current.fetchScheduleDefinition(path));

    expect(result.current.scheduleDefinitions).toEqual({ [path]: scheduleDefinition });
    expect(result.current.loadingStatuses).toEqual({ [path]: false });
    expect(mockAxiosRequest).toHaveBeenCalledTimes(1);

    await actAndAwaitForHook(() => result.current.fetchScheduleDefinition(path));

    expect(result.current.scheduleDefinitions).toEqual({ [path]: scheduleDefinition });
    expect(result.current.loadingStatuses).toEqual({ [path]: false });
    expect(mockAxiosRequest).toHaveBeenCalledTimes(1);
  });

  it("doesn't load the definition when data is currently being fetched", async () => {
    jest.useFakeTimers();

    mockAxiosRequest.mockReturnValue(new Promise(resolve => setTimeout(resolve, 100)));

    const { result } = renderHook(() => useScheduleDefinitionContext(), {
      wrapper: ScheduleDefinitionContextProvider,
    });

    expect(result.current.scheduleDefinitions).toEqual({});
    expect(result.current.loadingStatuses).toEqual({});
    expect(mockAxiosRequest).not.toHaveBeenCalled();

    await actAndAwaitForHook(() => result.current.fetchScheduleDefinition(path));

    expect(result.current.scheduleDefinitions).toEqual({ [path]: undefined });
    expect(result.current.loadingStatuses).toEqual({ [path]: true });
    expect(mockAxiosRequest).toHaveBeenCalledTimes(1);

    await actAndAwaitForHook(() => result.current.fetchScheduleDefinition(path));

    expect(result.current.scheduleDefinitions).toEqual({ [path]: undefined });
    expect(result.current.loadingStatuses).toEqual({ [path]: true });
    expect(mockAxiosRequest).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
