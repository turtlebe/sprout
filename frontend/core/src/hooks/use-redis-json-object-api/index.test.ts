import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { act, renderHook } from '@testing-library/react-hooks';

import { RedisJsonObject, useRedisJsonObjectApi } from '.';

jest.mock('@plentyag/core/src/hooks');

interface MockObject {
  name: string;
  value: string;
}
const mockObject: MockObject = {
  name: 'mock',
  value: 'mock',
};
const mockRedisJsonObject: RedisJsonObject<MockObject> = { key: 'mock-key', id: 'mock-id', value: mockObject };

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useRedisJsonObjectApi', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('returns default values', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined });
    const { result } = renderHook(() => useRedisJsonObjectApi());

    expect(result.current.redisJsonObject).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.createRedisJsonObject).toBeDefined();
    expect(result.current.updateRedisJsonObject).toBeDefined();
  });

  it('creates a RedisJsonObject', () => {
    const makeRequest = jest.fn().mockImplementation(args => {
      expect(args).toHaveProperty('data', { value: mockObject });
      expect(args).toHaveProperty('onSuccess');
      args.onSuccess(mockRedisJsonObject);
    });
    mockUsePostRequest.mockReturnValue({ isLoading: true, makeRequest, data: mockRedisJsonObject });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined });
    const { result } = renderHook(() => useRedisJsonObjectApi<MockObject>());

    act(() => result.current.createRedisJsonObject({ value: mockObject }));

    expect(result.current.redisJsonObject).toEqual(mockRedisJsonObject);
    expect(result.current.isLoading).toBe(true);
    expect(makeRequest).toHaveBeenCalled();
  });

  it('executes an onSuccess callback after creating a RedisJsonObject', () => {
    const makeRequest = jest.fn().mockImplementation(args => {
      expect(args).toHaveProperty('data', { value: mockObject });
      expect(args).toHaveProperty('onSuccess');
      args.onSuccess(mockRedisJsonObject);
    });
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ isLoading: true, makeRequest, data: mockRedisJsonObject });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined });
    const { result } = renderHook(() => useRedisJsonObjectApi<MockObject>());

    act(() => result.current.createRedisJsonObject({ value: mockObject, onSuccess }));

    expect(result.current.redisJsonObject).toEqual(mockRedisJsonObject);
    expect(result.current.isLoading).toBe(true);
    expect(makeRequest).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it('updates a RedisJsonObject for a given key', () => {
    const makeRequest = jest.fn().mockImplementation(args => {
      expect(args).toHaveProperty('data', { value: mockObject });
      expect(args).toHaveProperty('onSuccess');
      args.onSuccess(mockRedisJsonObject);
    });
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest, data: mockRedisJsonObject });
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockRedisJsonObject });
    const { result } = renderHook(() => useRedisJsonObjectApi(mockRedisJsonObject.key));

    act(() => result.current.updateRedisJsonObject({ value: mockObject }));

    expect(result.current.redisJsonObject).toEqual(mockRedisJsonObject);
    expect(result.current.isLoading).toBe(false);
    expect(makeRequest).toHaveBeenCalled();
  });

  it('executes an onSuccess callback after updated a RedisJsonObject', () => {
    const makeRequest = jest.fn().mockImplementation(args => {
      expect(args).toHaveProperty('data', { value: mockObject });
      expect(args).toHaveProperty('onSuccess');
      args.onSuccess(mockRedisJsonObject);
    });
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest, data: mockRedisJsonObject });
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockRedisJsonObject });
    const { result } = renderHook(() => useRedisJsonObjectApi(mockRedisJsonObject.key));

    act(() => result.current.updateRedisJsonObject({ value: mockObject, onSuccess }));

    expect(result.current.redisJsonObject).toEqual(mockRedisJsonObject);
    expect(result.current.isLoading).toBe(false);
    expect(makeRequest).toHaveBeenCalledWith({
      data: { value: mockObject },
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('fetches a RedisJsonObject for a given key', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockRedisJsonObject });
    const { result } = renderHook(() => useRedisJsonObjectApi(mockRedisJsonObject.key));

    act(() => result.current.createRedisJsonObject(mockObject));

    expect(result.current.redisJsonObject).toEqual(mockRedisJsonObject);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns a loading status while creating the RedisJsonObject', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: true, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined });

    const { result } = renderHook(() => useRedisJsonObjectApi(mockRedisJsonObject.key));

    act(() => result.current.createRedisJsonObject(mockObject));

    expect(result.current.redisJsonObject).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('returns a loading status while updating the RedisJsonObject', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ isLoading: true, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined });

    const { result } = renderHook(() => useRedisJsonObjectApi(mockRedisJsonObject.key));

    act(() => result.current.createRedisJsonObject(mockObject));

    expect(result.current.redisJsonObject).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it('returns a loading status while fecthing the RedisJsonObject', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockReturnValue({ isValidating: true, data: undefined });

    const { result } = renderHook(() => useRedisJsonObjectApi(mockRedisJsonObject.key));

    act(() => result.current.createRedisJsonObject(mockObject));

    expect(result.current.redisJsonObject).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });
});
