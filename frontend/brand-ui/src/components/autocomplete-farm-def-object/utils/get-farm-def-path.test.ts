import { getFarmDefPath } from './get-farm-def-path';

describe('getFarmDefPath', () => {
  it('returns the full path for a given shortened path', () => {
    expect(getFarmDefPath('SSF2/')).toBe('sites/SSF2');
    expect(getFarmDefPath('SSF2')).toBe('sites/SSF2');
    expect(getFarmDefPath('SSF2/BM')).toBe('sites/SSF2/areas/BM');
    expect(getFarmDefPath('SSF2/Propagation/Propagation')).toBe('sites/SSF2/areas/Propagation/lines/Propagation');
    expect(getFarmDefPath('SSF2/Propagation/Propagation/')).toBe('sites/SSF2/areas/Propagation/lines/Propagation');
  });

  it('returns itself when already a valid FarmDef path', () => {
    expect(getFarmDefPath('sites/SSF2')).toBe('sites/SSF2');
    expect(getFarmDefPath('sites/SSF2/areas/Propagation')).toBe('sites/SSF2/areas/Propagation');
  });
});
