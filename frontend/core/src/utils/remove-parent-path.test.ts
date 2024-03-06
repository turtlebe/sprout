import { removeParentPath } from './remove-parent-path';

describe('removeParentPath', () => {
  it('removes the parent path safely', () => {
    const gp1 = 'sites/LAR1/areas/NorthBuilding/lines/GP1';
    const gp1Hvac = gp1 + '/machines/HVAC';
    const gp2 = 'sites/LAR1/areas/NorthBuilding/lines/GP2';
    const gp10 = 'sites/LAR1/areas/NorthBuilding/lines/GP10';

    expect(removeParentPath(gp1Hvac, gp1)).toBe('machines/HVAC');
    expect(removeParentPath(gp10, gp1)).toBe(gp10);
    expect(removeParentPath(gp1, gp1)).toBe('');
    expect(removeParentPath(gp2, gp1)).toBe(gp2);
  });
});
