import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { PermissionLevels } from '@plentyag/core/src/core-store/types';
import { renderHook } from '@testing-library/react-hooks';

import { PERMISSION_ERROR, useHasProductionPermissions } from '.';

mockGlobalSnackbar();

mockCurrentUser({ permissions: { HYP_PRODUCTION: 'READ_AND_LIST' } });

describe('useHasProductionPermissions', () => {
  beforeEach(() => {
    errorSnackbar.mockClear();
  });

  it('show snackbar error when user does not have permission', () => {
    renderHook(() => useHasProductionPermissions(PermissionLevels.EDIT));
    expect(errorSnackbar).toHaveBeenCalledWith({ message: PERMISSION_ERROR });
  });

  it('shows no snackbar error when user has permission', () => {
    renderHook(() => useHasProductionPermissions(PermissionLevels.READ_AND_LIST));
    expect(errorSnackbar).not.toHaveBeenCalled();
  });
});
