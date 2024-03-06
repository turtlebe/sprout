import {
  mockGlobalSnackbar,
  successSnackbar,
  warningSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { Schedule } from '@plentyag/core/src/types/environment';
import { renderHook } from '@testing-library/react-hooks';

import { useScheduleHandler } from '.';

mockGlobalSnackbar();

const schedule = { id: 'id' } as unknown as Schedule;
const headerNotSyncedWithEs = { 'x-is-synced-with-es': 'false' };
const headerSyncedWithEs = {};

describe('useScheduleHandler', () => {
  beforeEach(() => {
    successSnackbar.mockRestore();
    warningSnackbar.mockRestore();
  });

  it('shows a message indicating the Schedule has been created', () => {
    const { result } = renderHook(() => useScheduleHandler());

    result.current.handleCreated(schedule, headerSyncedWithEs);

    expect(successSnackbar).toHaveBeenCalled();
    expect(warningSnackbar).not.toHaveBeenCalled();
  });

  it('shows a message indicating the Schedule has been updated', () => {
    const { result } = renderHook(() => useScheduleHandler());

    result.current.handleUpdated(schedule, headerSyncedWithEs);

    expect(successSnackbar).toHaveBeenCalled();
    expect(warningSnackbar).not.toHaveBeenCalled();
  });

  it('shows a message indicating the Schedule has been created but not synced with ES', () => {
    const { result } = renderHook(() => useScheduleHandler());

    result.current.handleCreated(schedule, headerNotSyncedWithEs);

    expect(successSnackbar).not.toHaveBeenCalled();
    expect(warningSnackbar).toHaveBeenCalled();
  });

  it('shows a message indicating the Schedule has been updated but not synced with ES', () => {
    const { result } = renderHook(() => useScheduleHandler());

    result.current.handleUpdated(schedule, headerNotSyncedWithEs);

    expect(successSnackbar).not.toHaveBeenCalled();
    expect(warningSnackbar).toHaveBeenCalled();
  });
});
