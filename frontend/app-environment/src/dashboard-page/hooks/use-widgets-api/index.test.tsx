import { buildSchedule, buildWidget, buildWidgetItem } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwaitForHook, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils';
import { act, renderHook } from '@testing-library/react-hooks';

import { useWidgetsApi } from '.';

const dashboardId = 'dashboardId';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/utils/request');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockAxiosRequest = axiosRequest as jest.Mock;
const revalidate = jest.fn();
const widgets = [buildWidget({}), buildWidget({})];
const newWidgets = [buildWidget({})];

describe('useWidgetsApi', () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    mockUseSwrAxios.mockReturnValue({
      data: buildPaginatedResponse(widgets),
      isValidating: true,
      revalidate,
    });

    mockGlobalSnackbar();
  });

  it('returns widgets, a loader, and a revalidate function', () => {
    const { result } = renderHook(() => useWidgetsApi(dashboardId));

    expect(result.current.widgets).toEqual(widgets);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.reloadWidgets).toEqual(revalidate);
  });

  it('updates widgets locally', () => {
    const { result } = renderHook(() => useWidgetsApi(dashboardId));

    expect(result.current.widgets).toEqual(widgets);

    act(() => result.current.updateWidgetsLocally(newWidgets));

    expect(result.current.widgets).toEqual(newWidgets);
  });

  it('updates widgets on the backend', async () => {
    mockAxiosRequest.mockResolvedValue({ data: newWidgets[0] });

    const { result } = renderHook(() => useWidgetsApi(dashboardId));

    expect(result.current.widgets).toEqual(widgets);
    expect(mockAxiosRequest).toHaveBeenCalledTimes(0);

    act(() => result.current.updateWidgetsLocally(newWidgets));
    await actAndAwaitForHook(() => result.current.persistWidgets());

    expect(result.current.widgets).toEqual(newWidgets);
    expect(mockAxiosRequest).toHaveBeenCalledTimes(1);
    expect(mockAxiosRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: EVS_URLS.widgets.updateUrl(newWidgets[0]),
      data: newWidgets[0],
    });
  });

  it('resets widgets to its initial state', () => {
    const { result } = renderHook(() => useWidgetsApi(dashboardId));

    expect(result.current.widgets).toEqual(widgets);

    act(() => result.current.updateWidgetsLocally(newWidgets));

    expect(result.current.widgets).toEqual(newWidgets);

    act(() => result.current.resetWidgets());

    expect(result.current.widgets).toEqual(widgets);
  });

  it('overrides a widget', () => {
    const newWidget = { ...widgets[1], items: [buildWidgetItem(buildSchedule({}))] };
    const { result } = renderHook(() => useWidgetsApi(dashboardId));

    expect(result.current.widgets).toEqual(widgets);

    act(() => result.current.overrideWidget(newWidget));

    expect(result.current.widgets).toEqual([widgets[0], newWidget]);

    act(() => result.current.resetWidgets());

    expect(result.current.widgets).toEqual([widgets[0], newWidget]);
  });
});
