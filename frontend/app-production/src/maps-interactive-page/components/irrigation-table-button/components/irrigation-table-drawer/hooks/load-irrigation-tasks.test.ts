import { IrrigationTask } from '@plentyag/app-production/src/maps-interactive-page/types';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useUnpaginate } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { mockIrrigationTasks } from '../../../test-helpers/mock-irrigation-tasks';

import { useLoadIrrigationTasks } from './load-irrigation-tasks';

jest.mock('@plentyag/core/src/hooks/use-unpaginate');
const mockuseUnpaginate = useUnpaginate as jest.MockedFunction<typeof useUnpaginate>;

mockGlobalSnackbar();

function createMockUnpaginate(data: IrrigationTask[]) {
  const mockMakeRequest = jest.fn().mockImplementation(({ onSuccess }) => {
    onSuccess(data);
  });

  mockuseUnpaginate.mockReturnValue({
    makeRequest: mockMakeRequest,
    data,
    isLoading: false,
    error: undefined,
  });

  return mockMakeRequest;
}

describe('useLoadIrrigationTasks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads when lotName is provided', () => {
    const mockMakeRequest = createMockUnpaginate(mockIrrigationTasks);

    const { result } = renderHook(() => useLoadIrrigationTasks({ lotName: 'mock-lot-name' }));

    expect(mockMakeRequest).toHaveBeenCalledWith(expect.objectContaining({ data: { lotName: 'mock-lot-name' } }));
    expect(result.current.irrigationTasks).toEqual(mockIrrigationTasks);
  });

  it('does not load when lotName is not provided', () => {
    const mockMakeRequest = createMockUnpaginate(undefined);

    const { result } = renderHook(() => useLoadIrrigationTasks({}));

    expect(mockMakeRequest).not.toHaveBeenCalled();
    expect(result.current.irrigationTasks).toBeUndefined();
  });

  it('reloads tasks when "refreshIrrigationTasks" function is called', () => {
    const mockMakeRequest = createMockUnpaginate(mockIrrigationTasks);

    const { result } = renderHook(() => useLoadIrrigationTasks({ lotName: 'mock-lot-name' }));

    expect(mockMakeRequest).toHaveBeenCalled();
    mockMakeRequest.mockClear();

    result.current.refreshIrrigationTasks();

    expect(mockMakeRequest).toHaveBeenCalledWith(expect.objectContaining({ data: { lotName: 'mock-lot-name' } }));
    expect(result.current.irrigationTasks).toEqual(mockIrrigationTasks);
  });

  it('shows snackbar error when no irrigation tasks are loaded', () => {
    createMockUnpaginate([]);

    expect(errorSnackbar).toHaveBeenCalledTimes(0);

    renderHook(() => useLoadIrrigationTasks({ lotName: 'mock-lot-name' }));

    expect(errorSnackbar).toHaveBeenCalledTimes(1);
  });
});
