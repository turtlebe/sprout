import { getFarmName } from '.';

describe('getFarmName', () => {
  it('returns farm name from farm path', () => {
    expect(getFarmName('sites/SSF2/farm/Tigris')).toBe('Tigris');
  });

  it('returns undefined when farm path not provided', () => {
    expect(getFarmName('')).toBe(undefined);
  });
});
