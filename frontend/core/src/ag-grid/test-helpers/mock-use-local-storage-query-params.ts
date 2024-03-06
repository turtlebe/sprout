import { useLocalStorageQueryParams } from '@plentyag/core/src/ag-grid/hooks';

jest.mock('@plentyag/core/src/ag-grid/hooks/use-local-storage-query-params');

export function mockUseLocalStorageQueryParams(mockLocalStorageValue: any = {}) {
  const mockSetLocalStorageValue = jest.fn();
  const mockUseLocalStorageQueryParams = useLocalStorageQueryParams as jest.Mock;
  mockUseLocalStorageQueryParams.mockReturnValue([mockLocalStorageValue, mockSetLocalStorageValue]);

  return { mockLocalStorageValue, mockSetLocalStorageValue };
}
