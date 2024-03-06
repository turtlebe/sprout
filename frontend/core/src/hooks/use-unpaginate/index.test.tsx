import { usePostRequest } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { UNPAGINATE_DEFAULT_LIMIT, UNPAGINATE_SWAGGER_URL, UNPAGINATE_URL, useUnpaginate } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const makeRequest = jest.fn();

const serviceName = 'serviceName';
const apiName = 'apiName';
const operation = 'operation';
const response = [{ item: 1 }, { item: 2 }];
const payload = { foo: 'bar', baz: { foo: 'bar' } };

describe('useUnpaginate', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    makeRequest.mockRestore();
  });

  it('returns data, a loading state and a custom `makeRequest` callback', () => {
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    const { result } = renderHook(() => useUnpaginate({ serviceName, operation }));

    expect(result.current.data).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.makeRequest).toBeDefined();
    expect(result.current.makeRequest).not.toEqual(makeRequest);
  });

  it('calls the unpaginate endpoint when given simplified payload', () => {
    mockUsePostRequest.mockReturnValue({ data: response, isLoading: false, makeRequest });

    const { result } = renderHook(() => useUnpaginate({ serviceName, operation }));

    result.current.makeRequest({ data: payload });

    expect(mockUsePostRequest).toHaveBeenCalledWith({ url: UNPAGINATE_URL });
    expect(makeRequest).toHaveBeenCalledWith({
      data: { serviceName, operation, bodyRequest: { limit: UNPAGINATE_DEFAULT_LIMIT, ...payload } },
    });
    expect(result.current.data).toEqual(response);
  });

  it('calls the swagger unpaginate endpoint when given simplified payload', () => {
    mockUsePostRequest.mockReturnValue({ data: response, isLoading: false, makeRequest });

    const { result } = renderHook(() => useUnpaginate({ serviceName, apiName, operation }));

    result.current.makeRequest({ data: payload });

    expect(mockUsePostRequest).toHaveBeenCalledWith({ url: UNPAGINATE_SWAGGER_URL });
    expect(makeRequest).toHaveBeenCalledWith({
      data: { serviceName, apiName, operation, bodyRequest: { limit: UNPAGINATE_DEFAULT_LIMIT, ...payload } },
    });
    expect(result.current.data).toEqual(response);
  });

  it('calls an onSuccess callback', () => {
    const onSuccess = jest.fn();
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess(response));
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });

    const { result } = renderHook(() => useUnpaginate({ serviceName, operation }));

    result.current.makeRequest({ onSuccess });

    expect(onSuccess).toHaveBeenCalledWith(response);
  });

  it('calls an onError callback and returns error', () => {
    const onError = jest.fn();
    makeRequest.mockImplementation(({ onError }) => onError(response));
    mockUsePostRequest.mockReturnValue({ data: undefined, error: response, isLoading: false, makeRequest });

    const { result } = renderHook(() => useUnpaginate({ serviceName, operation }));

    result.current.makeRequest({ onError });

    expect(onError).toHaveBeenCalledWith(response);
    expect(result.current.error).toEqual(response);
  });
});
