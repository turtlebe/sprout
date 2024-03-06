import { actAndAwaitForHook as actAndAwait } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { act, renderHook } from '@testing-library/react-hooks';
import { AxiosRequestConfig } from 'axios';

jest.mock('@plentyag/core/src/utils/request');

import { useAxios, useDeleteRequest, useGetRequest, usePatchRequest, usePostRequest, usePutRequest } from '.';

const defaultAxiosConfig: AxiosRequestConfig = {
  method: 'POST',
  url: '/mock-url',
};

const mockAxiosRequest = axiosRequest as jest.Mock;

beforeEach(() => mockAxiosRequest.mockClear());

describe('useGetRequest', () => {
  beforeEach(() => {
    mockAxiosRequest.mockRestore();
  });

  it('should use method "GET"', async () => {
    const url = defaultAxiosConfig.url;
    mockAxiosRequest.mockReturnValue(new Promise(() => {}));
    const { result, waitForNextUpdate } = renderHook(() => useGetRequest({ url }));
    await actAndAwait(async () => {
      result.current.makeRequest();
      await waitForNextUpdate();
    });
    expect(mockAxiosRequest).toBeCalledWith({ data: undefined, url, method: 'GET' });
  });

  it('uses query string parameters in "GET" method', async () => {
    const url = defaultAxiosConfig.url;
    const queryParams = { param1: 'one', param2: [1, 2, 3] };
    const urlWithParams = url + '?param1=one&param2=1%2C2%2C3';
    mockAxiosRequest.mockReturnValue(new Promise(() => {}));
    const { result, waitForNextUpdate } = renderHook(() => useGetRequest({ url }));
    await actAndAwait(async () => {
      result.current.makeRequest({ queryParams });
      await waitForNextUpdate();
    });
    expect(mockAxiosRequest).toBeCalledWith({ data: undefined, url: urlWithParams, method: 'GET' });
  });

  it('allows to define the URL when calling makingRequest', async () => {
    mockAxiosRequest.mockReturnValue({});
    const { result } = renderHook(() => useGetRequest({}));

    await actAndAwait(() => result.current.makeRequest({ url: '/mock-endpoint' }));

    expect(mockAxiosRequest).toHaveBeenCalledWith({ url: '/mock-endpoint', method: 'GET', data: undefined });
  });

  it('throws an error when calling makeRequest without a url', async () => {
    mockAxiosRequest.mockReturnValue({});

    const { result } = renderHook(() => useGetRequest({}));

    await actAndAwait(() => {
      const promise = result.current.makeRequest();
      (promise as unknown as Promise<unknown>).catch(error =>
        expect(error).toEqual(Error('`url` is undefined. Please specify a url when using `useAxios` or `makeRequest`'))
      );
    });

    expect.assertions(1);
  });
});

describe('useDeleteRequest', () => {
  it('should use method "DELETE"', async () => {
    const url = defaultAxiosConfig.url;
    mockAxiosRequest.mockReturnValue(new Promise(() => {}));
    const { result, waitForNextUpdate } = renderHook(() => useDeleteRequest({ url }));
    await actAndAwait(async () => {
      result.current.makeRequest({});
      await waitForNextUpdate();
    });
    expect(mockAxiosRequest).toBeCalledWith({ data: undefined, url, method: 'DELETE' });
  });
});

describe('usePatchRequest', () => {
  it('should use method "PATCH"', async () => {
    const url = defaultAxiosConfig.url;
    const data = { myData: 1 };
    mockAxiosRequest.mockReturnValue(new Promise(() => {}));
    const { result, waitForNextUpdate } = renderHook(() => usePatchRequest({ url }));
    await actAndAwait(async () => {
      result.current.makeRequest({ data });
      await waitForNextUpdate();
    });
    expect(mockAxiosRequest).toBeCalledWith({ data: data, url, method: 'PATCH' });
  });
});

describe('usePatchRequest', () => {
  it('should use method "PUT"', async () => {
    const url = defaultAxiosConfig.url;
    const data = { myData: 1 };
    mockAxiosRequest.mockReturnValue(new Promise(() => {}));
    const { result, waitForNextUpdate } = renderHook(() => usePutRequest({ url }));
    await actAndAwait(async () => {
      result.current.makeRequest({ data });
      await waitForNextUpdate();
    });
    expect(mockAxiosRequest).toBeCalledWith({ data: data, url, method: 'PUT' });
  });
});

describe('usePostRequest', () => {
  it('should use method "POST"', async () => {
    const url = defaultAxiosConfig.url;
    const data = { myData: 1 };
    mockAxiosRequest.mockReturnValue(new Promise(() => {}));
    const { result, waitForNextUpdate } = renderHook(() => usePostRequest({ url }));
    await actAndAwait(async () => {
      result.current.makeRequest({ data });
      await waitForNextUpdate();
    });
    expect(mockAxiosRequest).toBeCalledWith({ data: data, url, method: 'POST' });
  });
});

describe('useAxios', () => {
  it('returns a loader, data, errors and a callback to make a request', () => {
    const { result } = renderHook(() => useAxios(defaultAxiosConfig));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(undefined);
    expect(result.current.error).toBe(undefined);
    expect(result.current.makeRequest).toBeInstanceOf(Function);
  });

  it('sets the loader to true when making the request', async () => {
    mockAxiosRequest.mockReturnValue(new Promise(() => {}));
    const { result, waitForNextUpdate } = renderHook(() => useAxios(defaultAxiosConfig));

    expect(result.current.isLoading).toBe(false);

    await actAndAwait(async () => {
      result.current.makeRequest();
      await waitForNextUpdate();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(undefined);
    expect(result.current.error).toBe(undefined);
  });

  it('returns the data', async () => {
    mockAxiosRequest.mockResolvedValue({ data: { json: 'mock-json' } });
    const { result, waitForNextUpdate } = renderHook(() => useAxios(defaultAxiosConfig));

    await actAndAwait(async () => {
      result.current.makeRequest();
      await waitForNextUpdate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({ json: 'mock-json' });
    expect(result.current.error).toBe(undefined);
  });

  it('returns network errors', async () => {
    mockAxiosRequest.mockRejectedValue({ response: { data: 'error' } });
    const { result, waitForNextUpdate } = renderHook(() => useAxios(defaultAxiosConfig));

    await actAndAwait(async () => {
      result.current.makeRequest();
      await waitForNextUpdate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(undefined);
    expect(result.current.error).toEqual({ data: 'error' });
  });

  it('executes onSuccess callback', async () => {
    const headers = { 'custom-header': 'custom-header-value' };
    mockAxiosRequest.mockResolvedValue({ data: { json: 'mock-json' }, headers });
    const { result, waitForNextUpdate } = renderHook(() => useAxios(defaultAxiosConfig));
    const onSuccess = jest.fn();

    const postData = {
      hello: 'world',
    };
    await actAndAwait(async () => {
      result.current.makeRequest({ data: postData, onSuccess });
      await waitForNextUpdate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({ json: 'mock-json' });
    expect(result.current.error).toBe(undefined);
    expect(onSuccess).toHaveBeenCalledWith({ json: 'mock-json' }, headers);
    expect(mockAxiosRequest).toHaveBeenCalledWith({ ...defaultAxiosConfig, ...{ data: postData } });
  });

  it('executes async onSuccess callback', async () => {
    const headers = { 'custom-header': 'custom-header-value' };
    mockAxiosRequest.mockResolvedValue({ data: { json: 'mock-json' }, headers });
    const { result, waitForNextUpdate } = renderHook(() => useAxios(defaultAxiosConfig));
    const onSuccess = jest.fn().mockResolvedValue({});

    const postData = {
      hello: 'world',
    };
    await actAndAwait(async () => {
      result.current.makeRequest({ data: postData, onSuccess });
      await waitForNextUpdate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({ json: 'mock-json' });
    expect(result.current.error).toBe(undefined);
    expect(onSuccess).toHaveBeenCalledWith({ json: 'mock-json' }, headers);
    expect(mockAxiosRequest).toHaveBeenCalledWith({ ...defaultAxiosConfig, ...{ data: postData } });
  });

  it('executes onError callback', async () => {
    mockAxiosRequest.mockRejectedValue({ response: { json: 'mock-error-json' } });
    const { result, waitForNextUpdate } = renderHook(() => useAxios(defaultAxiosConfig));
    const onError = jest.fn();

    await actAndAwait(async () => {
      result.current.makeRequest({ onError });
      await waitForNextUpdate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(undefined);
    expect(result.current.error).toEqual({ json: 'mock-error-json' });
    expect(onError).toHaveBeenCalledWith({ json: 'mock-error-json' });
  });

  it('executes onError callback for request error', async () => {
    // see axios docs: https://github.com/axios/axios#handling-errors
    const error = { request: { json: 'mock-error-json' } };
    mockAxiosRequest.mockRejectedValue(error);
    const { result, waitForNextUpdate } = renderHook(() => useAxios(defaultAxiosConfig));
    const onError = jest.fn();

    await actAndAwait(async () => {
      result.current.makeRequest({ onError });
      await waitForNextUpdate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(undefined);
    expect(result.current.error).toEqual(error);
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('bubbles up non-network errors', async () => {
    mockAxiosRequest.mockRejectedValue({ data: Error('test') });
    const { result } = renderHook(() => useAxios(defaultAxiosConfig));

    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await act(async () => await result.current.makeRequest());
      throw new Error('should not have thrown');
    } catch (error) {
      expect(error).toEqual({ data: Error('test') });
    }
  });

  it('updates the makeRequest callback when the config changes', async () => {
    mockAxiosRequest.mockReturnValue({});

    const { result, rerender, waitForNextUpdate } = renderHook(({ axiosConfig }) => useAxios(axiosConfig), {
      initialProps: { axiosConfig: defaultAxiosConfig },
    });

    await actAndAwait(async () => {
      result.current.makeRequest();
      await waitForNextUpdate();
    });
    expect(mockAxiosRequest).toHaveBeenCalledWith(defaultAxiosConfig);

    mockAxiosRequest.mockClear();
    const otherConfig: AxiosRequestConfig = { method: 'POST', url: '/another-url' };
    rerender({
      axiosConfig: otherConfig,
    });

    await actAndAwait(async () => {
      result.current.makeRequest();
      await waitForNextUpdate();
    });
    expect(mockAxiosRequest).toHaveBeenCalledWith(otherConfig);
  });
});
