import { getActiveFarms } from '.';

describe('getActiveFarms', () => {
  it('returns empty list (no active farms)', () => {
    expect(
      getActiveFarms({
        'sites/SSF2/farms/Tigris': false,
        'sites/LAX1/farms/LAX1': false,
      })
    ).toHaveLength(0);
  });

  it('returns empty list with empty, undefined, null', () => {
    expect(getActiveFarms({})).toHaveLength(0);
    expect(getActiveFarms(null)).toHaveLength(0);
    expect(getActiveFarms(undefined)).toHaveLength(0);
  });

  it('returns active farms', () => {
    expect(
      getActiveFarms({
        'sites/SSF2/farms/Tigris': false,
        'sites/LAX1/farms/LAX1': true,
      })
    ).toEqual(['LAX1']);
  });
});
