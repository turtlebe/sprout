import { toQueryParams } from './to-query-params';

describe('toQueryParams', () => {
  it('returns ""', () => {
    expect(toQueryParams()).toBe('');
    expect(toQueryParams(null)).toBe('');
    expect(toQueryParams(undefined)).toBe('');
    expect(toQueryParams(0)).toBe('');
    expect(toQueryParams('something')).toBe('');
    expect(toQueryParams({})).toBe('');
    expect(toQueryParams({ foo: undefined })).toBe('');
    expect(toQueryParams({ baz: [] })).toBe('');
  });

  it('returns a query params string representing an object', () => {
    expect(toQueryParams({ string: 'stringValue', number: 1, boolean: true, null: null, array: ['a', 'b'] })).toBe(
      '?string=stringValue&number=1&boolean=true&null=null&array=a%2Cb'
    );
  });

  it('does not encode an array', () => {
    expect(
      toQueryParams(
        { string: 'stringValue', number: 1, boolean: true, null: null, array: ['a', 'b'] },
        { doNotEncodeArray: true }
      )
    ).toBe('?string=stringValue&number=1&boolean=true&null=null&array[]=a&array[]=b');
  });

  it('encodes query parameters using snake case', () => {
    expect(
      toQueryParams(
        { stringValue: 'stringValue', numberValue: 1, booleanValue: true, nullValue: null, arrayValue: ['a', 'b'] },
        { encodeKeyUsingSnakeCase: true }
      )
    ).toBe('?string_value=stringValue&number_value=1&boolean_value=true&null_value=null&array_value=a%2Cb');
  });
});
