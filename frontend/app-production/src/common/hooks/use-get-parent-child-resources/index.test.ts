import {
  mockResult,
  mockResultWithChildren,
  mockResultWithParent,
  mockResultWithParentAndChildren,
} from '@plentyag/app-production/src/resources-page/components/search/mock-search-result';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { act, renderHook } from '@testing-library/react-hooks';
import { clone } from 'lodash';

import { useGetParentChildResources } from '.';

import { mockData } from './mock-get-states-by-historic-ids';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/utils/request');
const mockAxiosRequest = axiosRequest as jest.Mock;

describe('useGetParentChildResources', () => {
  beforeEach(() => {
    mockAxiosRequest.mockClear();
  });

  it('does no fetch and returns no data if resource has no parents or children', () => {
    const { result } = renderHook(() => useGetParentChildResources(mockResult));

    expect(mockAxiosRequest).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.parentResource).toBeNull();
    expect(result.current.childResources).toBeNull();
  });

  it('sets children/parent to null when fetch fails', async () => {
    mockAxiosRequest.mockRejectedValue({ response: { data: { message: { error: 'ouch' } } } });

    const { result, waitForNextUpdate } = renderHook(() => useGetParentChildResources(mockResultWithChildren));

    await act(async () => {
      await waitForNextUpdate();
      expect(result.current.childResources).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.parentResource).toBeNull();
      expect(errorSnackbar).toHaveBeenCalledWith({ message: 'Error fetching children/parent states ouch' });
    });
  });

  it('fetches children resources if resource only has children', async () => {
    mockAxiosRequest.mockResolvedValue({ data: mockData });

    const { result, waitForNextUpdate } = renderHook(() => useGetParentChildResources(mockResultWithChildren));

    await waitForNextUpdate();
    expect(result.current.childResources).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.parentResource).toBeNull();
  });

  it('fetches parent resource if resource only has a parent', async () => {
    const parentResource = mockData[0];
    mockAxiosRequest.mockResolvedValue({ data: [parentResource] });

    const { result, waitForNextUpdate } = renderHook(() => useGetParentChildResources(mockResultWithParent));

    await waitForNextUpdate();

    expect(result.current.parentResource).toEqual(mockData[0]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.childResources).toBeNull();
  });

  it('should update both children and parent from previous values', async () => {
    const parentResource = mockData[0];
    mockAxiosRequest.mockResolvedValue({ data: [parentResource] });

    // initially has parent but not children.
    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ searchResult }) => useGetParentChildResources(searchResult),
      {
        initialProps: {
          searchResult: mockResultWithParent,
        },
      }
    );

    await waitForNextUpdate();

    expect(result.current.parentResource).toEqual(mockData[0]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.childResources).toBeNull();

    mockAxiosRequest.mockResolvedValue({ data: mockData });

    rerender({ searchResult: mockResultWithChildren });

    await waitForNextUpdate();

    expect(result.current.childResources).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.parentResource).toBeNull();
  });

  it('fetches both children and parent resource if resource has both', async () => {
    mockAxiosRequest.mockResolvedValue({ data: mockData });

    const { result, waitForNextUpdate } = renderHook(() => useGetParentChildResources(mockResultWithParentAndChildren));

    await waitForNextUpdate();

    const mockDataClone = clone(mockData);
    mockDataClone.shift();
    const childResources = mockDataClone;
    expect(result.current.parentResource).toEqual(mockData[0]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.childResources).toEqual(childResources);
  });
});
