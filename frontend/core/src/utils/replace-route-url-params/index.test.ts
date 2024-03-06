import { replaceRouteUrlParams } from '.';

describe('replaceRouteUrlParams', () => {
  it('returns the string as is', () => {
    expect(replaceRouteUrlParams('foobar', undefined)).toBe('foobar');
    expect(replaceRouteUrlParams('foobar', {})).toBe('foobar');
    expect(replaceRouteUrlParams('foobar', null)).toBe('foobar');
  });

  it('replaces occurence of URL parameters by its value', () => {
    const result = replaceRouteUrlParams('/:dashboard/:dashboard/:name', {
      dashboard: 'my-dashboard',
      name: 'my-name',
    });

    expect(result).toBe('/my-dashboard/my-dashboard/my-name');
  });
});
