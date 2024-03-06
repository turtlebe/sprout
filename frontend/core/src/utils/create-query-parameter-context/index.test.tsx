import { act, renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ArrayParam, BooleanParam, QueryParamConfigMap } from 'serialize-query-params';

import { createQueryParameterContext } from '.';

interface MockQueryParameters {
  testBool: boolean;
  testArray: string[];
}

const mockQueryParamConfigMap: QueryParamConfigMap = {
  testBool: BooleanParam,
  testArray: ArrayParam,
};

const mockDefaultQueryParameters: MockQueryParameters = {
  testBool: false,
  testArray: [],
};

describe('createQueryParameterContext', () => {
  function createContext(defaultParameters = mockDefaultQueryParameters, initialEntry?: string) {
    const { useQueryParameter, QueryParameterProvider } =
      createQueryParameterContext<MockQueryParameters>(mockQueryParamConfigMap);
    const history = createMemoryHistory({ initialEntries: [initialEntry || '/'] });
    const result = renderHook(() => useQueryParameter(), {
      wrapper: ({ children }) => (
        <Router history={history}>
          <QueryParameterProvider defaultParameters={defaultParameters}>{children}</QueryParameterProvider>
        </Router>
      ),
    });

    return { history, ...result };
  }

  it('returns query parameters', () => {
    const initialSearch = '?testBool=1&testArray=foo&testArray=bar&test=3';
    const { history, result } = createContext(mockDefaultQueryParameters, `/${initialSearch}`);
    expect(result.current.parameters).toEqual({
      testBool: true,
      testArray: ['foo', 'bar'],
    });
    expect(history.location.search).toEqual(initialSearch);
  });

  it('returns defaults when query parameters are not present in the URL', () => {
    const { history, result } = createContext();
    expect(result.current.parameters).toEqual(mockDefaultQueryParameters);
    expect(history.location.search).toEqual('');
  });

  it('returns defaults when query parameters cannot be decoded', () => {
    const initialSearch = '?testBool=bad'; // invalid should be 0 or 1.
    const { history, result } = createContext(mockDefaultQueryParameters, `/${initialSearch}`);
    expect(result.current.parameters).toEqual({
      testBool: false,
      testArray: [],
    });
    expect(history.location.search).toEqual(initialSearch);
  });

  it('sets query parameters while perserving existing ones', () => {
    const initialSearch = '?something=else';
    const { history, result } = createContext(mockDefaultQueryParameters, `/${initialSearch}`);

    expect(result.current.parameters).toEqual({
      testBool: false,
      testArray: [],
    });

    act(() => {
      result.current.setParameters({ testBool: true });
    });

    expect(result.current.parameters).toEqual({
      testBool: true,
      testArray: [],
    });

    expect(history.location.search).toEqual('?something=else&testBool=1');

    act(() => {
      result.current.setParameters({ testArray: ['foo', 'bar'] });
    });

    expect(result.current.parameters).toEqual({
      testBool: true,
      testArray: ['foo', 'bar'],
    });

    expect(history.location.search).toEqual('?something=else&testBool=1&testArray=foo&testArray=bar');
  });

  it('sets query parameter but removes from URL when it is the same as the default', () => {
    const { history, result } = createContext();

    expect(result.current.parameters).toEqual({
      testBool: false,
      testArray: [],
    });

    act(() => {
      result.current.setParameters({ testBool: true });
    });

    expect(result.current.parameters).toEqual({
      testBool: true,
      testArray: [],
    });

    expect(history.location.search).toEqual('?testBool=1');

    act(() => {
      result.current.setParameters({ testBool: false });
    });

    expect(result.current.parameters).toEqual({
      testBool: false,
      testArray: [],
    });

    // testBool is no longer in the URL since it is same as default.
    expect(history.location.search).toEqual('');
  });

  it('resets the given query parameters while perserving existing ones', () => {
    const initialSearch = '?something=else';
    const { history, result } = createContext(mockDefaultQueryParameters, `/${initialSearch}`);

    expect(result.current.parameters).toEqual({
      testBool: false,
      testArray: [],
    });

    act(() => {
      result.current.setParameters({ testBool: true, testArray: ['foo', 'bar'] });
    });

    expect(result.current.parameters).toEqual({
      testBool: true,
      testArray: ['foo', 'bar'],
    });

    // reset should preverse existing parameters
    act(() => {
      result.current.resetParameters(['testBool']);
    });

    expect(history.location.search).toEqual('?something=else&testArray=foo&testArray=bar');
  });

  it('resets all query parameters while perserving existing ones', () => {
    const initialSearch = '?something=else';
    const { history, result } = createContext(mockDefaultQueryParameters, `/${initialSearch}`);

    expect(result.current.parameters).toEqual({
      testBool: false,
      testArray: [],
    });

    act(() => {
      result.current.setParameters({ testBool: true, testArray: ['foo', 'bar'] });
    });

    expect(result.current.parameters).toEqual({
      testBool: true,
      testArray: ['foo', 'bar'],
    });

    // reset all should preverse existing parameters
    act(() => {
      result.current.resetAllParameters();
    });

    expect(history.location.search).toEqual(initialSearch);
  });
});
