import { mockScheduleDefinitions } from '@plentyag/app-environment/src/common/test-helpers';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { getScheduleDefinitionUrl } from '../../utils/api-urls';

import { useFetchScheduleDefinition } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

mockGlobalSnackbar();

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const [scheduleDefinition] = mockScheduleDefinitions;

describe('useFetchScheduleDefinition', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
    errorSnackbar.mockRestore();
  });

  it('returns the loading state', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true, error: undefined });

    const { result } = renderHook(() => useFetchScheduleDefinition(scheduleDefinition.path));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: getScheduleDefinitionUrl(scheduleDefinition.path) });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isValidating).toBe(true);
    expect(errorSnackbar).not.toHaveBeenCalled();
  });

  it('returns as not loading if the given path is undefined', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: undefined });

    const { result } = renderHook(() => useFetchScheduleDefinition(undefined));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: undefined });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isValidating).toBe(false);
    expect(errorSnackbar).not.toHaveBeenCalled();
  });

  it('returns the ScheduleDefinition', () => {
    mockUseSwrAxios.mockReturnValue({ data: scheduleDefinition, isValidating: false, error: undefined });

    const { result } = renderHook(() => useFetchScheduleDefinition(scheduleDefinition.path));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: getScheduleDefinitionUrl(scheduleDefinition.path) });
    expect(result.current.data).toEqual(scheduleDefinition);
    expect(result.current.isValidating).toBe(false);

    expect(errorSnackbar).not.toHaveBeenCalled();
  });

  it('returns logs an error in the snackbar', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: 'error' });

    const { result } = renderHook(() => useFetchScheduleDefinition(scheduleDefinition.path));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: getScheduleDefinitionUrl(scheduleDefinition.path) });
    expect(result.current.data).toBeUndefined();
    expect(result.current.isValidating).toBe(false);
    expect(errorSnackbar).toHaveBeenCalledWith({ message: 'error', title: undefined });
    expect(consoleError).toHaveBeenCalledWith('error');
  });
});
