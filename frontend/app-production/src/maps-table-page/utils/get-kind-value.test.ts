import { getKindValue } from '.';

const PATH = 'sites/SSF2/areas/VerticalGrow/lines/GrowLane1';
describe('getKindValue', () => {
  it('returns undefined when emtpy farm def provided', () => {
    expect(getKindValue('', 'areas')).toBeUndefined();
  });

  it('returns undefined when kind provided', () => {
    expect(getKindValue(PATH, '')).toBeUndefined();
  });

  it('returns undefined when kind not found', () => {
    expect(getKindValue(PATH, 'bogus')).toBeUndefined();
  });

  it('returns value for sites', () => {
    expect(getKindValue(PATH, 'sites')).toBe('SSF2');
  });

  it('returns value for areas', () => {
    expect(getKindValue(PATH, 'areas')).toBe('VerticalGrow');
  });

  it('returns value for lines', () => {
    expect(getKindValue(PATH, 'lines')).toBe('GrowLane1');
  });
});
