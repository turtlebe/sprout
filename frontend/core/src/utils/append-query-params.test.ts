import { appendQueryParams } from './append-query-params';

describe('appendQueryParams', () => {
  const oldWindowLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        search: '?existing_value=true',
      },
      writable: true,
    });
  });

  afterAll(() => {
    window.location = oldWindowLocation;
  });

  it('returns at the least the existing query parameters if input is invalid or null', () => {
    expect(appendQueryParams(null)).toBe('?existing_value=true');
    expect(appendQueryParams(undefined)).toBe('?existing_value=true');
    expect(appendQueryParams(0)).toBe('?existing_value=true');
    expect(appendQueryParams('something')).toBe('?existing_value=true');
    expect(appendQueryParams({})).toBe('?existing_value=true');
    expect(appendQueryParams({ foo: undefined })).toBe('?existing_value=true');
    expect(appendQueryParams({ baz: [] })).toBe('?existing_value=true');
    expect(appendQueryParams({ existing_value: true })).toBe('?existing_value=true');
    expect(appendQueryParams({ existing_value: false })).toBe('?existing_value=false');
  });

  it('returns a query params string representing an object', () => {
    expect(appendQueryParams({ string: 'stringValue', number: 1, boolean: true, null: null, array: ['a', 'b'] })).toBe(
      '?existing_value=true&string=stringValue&number=1&boolean=true&null=null&array=a%2Cb'
    );
  });
});
