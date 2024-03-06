import { getLastPathSegmentFromStringPath } from './get-last-path-segment-from-string-path';

describe('getLastPathSegmentFromStringPath', () => {
  it('returns an empty string', () => {
    expect(getLastPathSegmentFromStringPath(null)).toEqual('');
    expect(getLastPathSegmentFromStringPath('')).toEqual('');
    expect(getLastPathSegmentFromStringPath('/')).toEqual('');
  });

  it('returns last path segment from string path', () => {
    expect(getLastPathSegmentFromStringPath('sites/SSF2')).toEqual('SSF2');
    expect(getLastPathSegmentFromStringPath('sites/SSF2/areas/SierraVerticalGrow')).toEqual('SierraVerticalGrow');
  });
});
