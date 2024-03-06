import {
  mockGlobalSnackbar,
  successSnackbar,
  warningSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { Dashboard } from '@plentyag/core/src/types/environment';
import { renderHook } from '@testing-library/react-hooks';

import { useDashboardHandler } from '.';

mockGlobalSnackbar();

const dashboard = { id: 'id' } as unknown as Dashboard;

describe('useDashboardHandler', () => {
  beforeEach(() => {
    successSnackbar.mockRestore();
    warningSnackbar.mockRestore();
  });

  it('shows a message indicating the Dashboard has been created', () => {
    const { result } = renderHook(() => useDashboardHandler());

    result.current.handleCreated(dashboard);

    expect(successSnackbar).toHaveBeenCalled();
    expect(warningSnackbar).not.toHaveBeenCalled();
  });

  it('shows a message indicating the Schedule has been updated', () => {
    const { result } = renderHook(() => useDashboardHandler());

    result.current.handleUpdated(dashboard);

    expect(successSnackbar).toHaveBeenCalled();
    expect(warningSnackbar).not.toHaveBeenCalled();
  });

  it('shows a message indicating the Dashboard has been created using the dashboardId', () => {
    const { result } = renderHook(() => useDashboardHandler());

    result.current.handleCreated(dashboard.id);

    expect(successSnackbar).toHaveBeenCalled();
    expect(warningSnackbar).not.toHaveBeenCalled();
  });

  it('shows a message indicating the Schedule has been updated using the dashboardId', () => {
    const { result } = renderHook(() => useDashboardHandler());

    result.current.handleUpdated(dashboard.id);

    expect(successSnackbar).toHaveBeenCalled();
    expect(warningSnackbar).not.toHaveBeenCalled();
  });
});
