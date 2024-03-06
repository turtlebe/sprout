import { act, renderHook } from '@testing-library/react-hooks';

import { useLogAxiosErrorInSnackbar } from '../hooks';
import { DEFAULT_ERROR_MESSSAGE } from '../utils';

import { CoreStoreProvider, initialCoreState, useCoreStore } from './index';

import { useFetchCurrentUser, useFetchFarmOsModules } from './hooks';
import { DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES } from './test-helpers';
import { CurrentUserData } from './types';

jest.mock('./hooks/use-fetch-current-user');
const mockUseFetchCurrentUser = useFetchCurrentUser as jest.Mock;

jest.mock('./hooks/use-fetch-farmos-modules');
const mockUseFetchFarmOsModules = useFetchFarmOsModules as jest.Mock;

jest.mock('../hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

const mockUser = DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES;

const mockFarmOsModulesData = {
  farmOsModules: ['HYP_ADMIN', 'HYP_CONTROLS', 'HYP_DATA'],
};

describe('useCoreStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function setMockUserData({ data = null, error = null }: { data?: CurrentUserData; error?: any } = {}) {
    mockUseFetchCurrentUser.mockReturnValue({
      data,
      error,
    });
  }

  function setMockFarmOsModulesData({ data = null, error = null }: { data?: any; error?: any } = {}) {
    mockUseFetchFarmOsModules.mockReturnValue({
      data,
      error,
    });
  }

  it('returns initialCoreState when no context provider is present', () => {
    setMockUserData();
    setMockFarmOsModulesData();

    const { result } = renderHook(() => useCoreStore());

    expect(result.current[0]).toEqual(initialCoreState);
  });

  it('has default state before any data is loaded', () => {
    setMockUserData();
    setMockFarmOsModulesData();

    const { result } = renderHook(() => useCoreStore(), {
      wrapper: CoreStoreProvider,
    });
    expect(result.current[0]).toEqual(initialCoreState);
  });

  it('loads user and farmOsModules data', () => {
    setMockUserData({ data: mockUser });
    setMockFarmOsModulesData({ data: mockFarmOsModulesData });

    const { result } = renderHook(() => useCoreStore(), {
      wrapper: CoreStoreProvider,
    });

    expect(result.current[0].currentUser).toEqual(mockUser);
    expect(result.current[0].farmOsModules).toEqual(mockFarmOsModulesData.farmOsModules);
  });

  it('gives error when failing to load current', () => {
    setMockUserData({ error: 'ouch' });
    setMockFarmOsModulesData();

    renderHook(() => useCoreStore(), {
      wrapper: CoreStoreProvider,
    });

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith('ouch', DEFAULT_ERROR_MESSSAGE);
  });

  it('gives error when failing to load farmos modules', () => {
    setMockUserData();
    setMockFarmOsModulesData({ error: 'ouch' });

    renderHook(() => useCoreStore(), {
      wrapper: CoreStoreProvider,
    });

    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith('ouch', DEFAULT_ERROR_MESSSAGE);
  });

  it('updates the store with the new value for action: currentFarmDefPath', () => {
    setMockUserData({ data: mockUser });
    setMockFarmOsModulesData({ data: mockFarmOsModulesData });

    const { result } = renderHook(() => useCoreStore(), {
      wrapper: CoreStoreProvider,
    });

    expect(result.current[0].currentUser.currentFarmDefPath).toBe(mockUser.currentFarmDefPath);

    const newCurrentFarmDefPath = 'sites/SSF2/farms/Tigris';

    act(() => {
      result.current[1].setCurrentFarmDefPath(newCurrentFarmDefPath);
    });

    expect(result.current[0].currentUser.currentFarmDefPath).toBe(newCurrentFarmDefPath);
  });
});
