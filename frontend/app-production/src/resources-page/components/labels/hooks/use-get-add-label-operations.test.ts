import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useGetRequest } from '@plentyag/core/src/hooks/use-axios';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';

import {
  mockGetAddLabelOperationsDataForContainer,
  mockGetAddLabelOperationsDataForMaterial,
} from './mock-get-add-label-operations-data';
import { useGetAddLabelOperations } from './use-get-add-label-operations';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUseGetRequest = useGetRequest as jest.Mock;

const mockSearchResultWithContainer: ProdResources.ResourceState = {
  id: '123',
  childResourceStateIds: [],
  containerId: 'xyz',
  containerLabels: ['test'],
  isLatest: false,
  updatedAt: '',
  location: {
    machine: {
      siteName: 'SSF2',
      areaName: 'area',
      lineName: 'line',
      farmdefMachineId: '456',
      traceabilityMachineId: '1',
    },
  },
};

const mockSearchResultWithMaterial: ProdResources.ResourceState = {
  id: '123',
  childResourceStateIds: [],
  materialId: 'xyz',
  materialLabels: ['other test'],
  isLatest: false,
  updatedAt: '',
  location: {
    machine: {
      siteName: 'SSF2',
      areaName: 'area',
      lineName: 'line',
      farmdefMachineId: '456',
      traceabilityMachineId: '1',
    },
  },
};

describe('useGetAddLabelOperations()', () => {
  it('shows snackbar error when backend returns error', () => {
    const mockMakeRequest = (params: { onError: any }) => {
      params.onError('ouch');
    };

    mockUseGetRequest.mockReturnValue({ data: undefined, makeRequest: mockMakeRequest });

    expect(errorSnackbar).not.toHaveBeenCalled();

    renderHook(() => useGetAddLabelOperations('CONTAINER', mockSearchResultWithContainer));

    expect(errorSnackbar).toHaveBeenCalled();
  });

  it('returns isLoading true when data not yet received from backend', () => {
    mockUseGetRequest.mockReturnValue({ data: undefined, makeRequest: () => {} });

    const { result } = renderHook(() => useGetAddLabelOperations('CONTAINER', mockSearchResultWithContainer));

    expect(result.current.isLoading).toBe(true);
  });

  it('gets container label operations', () => {
    const mockMakeRequest = jest.fn();

    mockUseGetRequest.mockReturnValue({
      data: mockGetAddLabelOperationsDataForContainer,
      makeRequest: mockMakeRequest,
    });

    const { result } = renderHook(() => useGetAddLabelOperations('CONTAINER', mockSearchResultWithContainer));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.foundAddLabelOperations.size).toBe(1);
    expect(result.current.foundAddLabelOperations.get('test')).toEqual(mockGetAddLabelOperationsDataForContainer[1]);

    expect(mockMakeRequest).toHaveBeenCalledWith({
      queryParams: { id: mockSearchResultWithContainer.containerId, id_type: 'CONTAINER_ID' },
      onError: expect.anything(),
    });
  });

  it('gets material label operations', () => {
    const mockMakeRequest = jest.fn();

    mockUseGetRequest.mockReturnValue({ data: mockGetAddLabelOperationsDataForMaterial, makeRequest: mockMakeRequest });

    const { result } = renderHook(() => useGetAddLabelOperations('MATERIAL', mockSearchResultWithMaterial));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.foundAddLabelOperations.size).toBe(1);
    expect(result.current.foundAddLabelOperations.get('other test')).toEqual(
      mockGetAddLabelOperationsDataForMaterial[0]
    );
    expect(mockMakeRequest).toHaveBeenCalledWith({
      queryParams: { id: mockSearchResultWithMaterial.materialId, id_type: 'MATERIAL_ID' },
      onError: expect.anything(),
    });
  });

  it('gets no label operations for label that does not exist', () => {
    const mockSearchResult = cloneDeep(mockSearchResultWithMaterial);
    // create a label that doesn't exist in mockGetAddLabelOpeationsDataForMaterial
    mockSearchResult.materialLabels = ['non-existent-label'];

    const mockMakeRequest = jest.fn();

    mockUseGetRequest.mockReturnValue({ data: mockGetAddLabelOperationsDataForMaterial, makeRequest: mockMakeRequest });

    const { result } = renderHook(() => useGetAddLabelOperations('MATERIAL', mockSearchResult));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.foundAddLabelOperations.size).toBe(0);
    expect(mockMakeRequest).toHaveBeenCalledWith({
      queryParams: { id: mockSearchResult.materialId, id_type: 'MATERIAL_ID' },
      onError: expect.anything(),
    });
  });

  it('refetches label operations when search result changes', () => {
    const mockMakeRequest = jest.fn();

    mockUseGetRequest.mockReturnValue({ data: mockGetAddLabelOperationsDataForMaterial, makeRequest: mockMakeRequest });

    const { rerender } = renderHook(({ searchResult }) => useGetAddLabelOperations('MATERIAL', searchResult), {
      initialProps: { searchResult: mockSearchResultWithMaterial },
    });

    expect(mockMakeRequest).toHaveBeenCalledWith({
      queryParams: { id: mockSearchResultWithMaterial.materialId, id_type: 'MATERIAL_ID' },
      onError: expect.anything(),
    });
    expect(mockMakeRequest).toHaveBeenCalledTimes(1);

    const newMockSearchResultWithMaterial = cloneDeep(mockSearchResultWithMaterial);

    rerender({ searchResult: newMockSearchResultWithMaterial });

    expect(mockMakeRequest).toHaveBeenCalledWith({
      queryParams: { id: mockSearchResultWithMaterial.materialId, id_type: 'MATERIAL_ID' },
      onError: expect.anything(),
    });
    expect(mockMakeRequest).toHaveBeenCalledTimes(2);
  });
});
