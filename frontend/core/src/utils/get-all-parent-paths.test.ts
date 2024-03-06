import { getAllParentPaths } from './get-all-parent-paths';

describe('getAllParentPaths', () => {
  it('returns an empty array', () => {
    expect(getAllParentPaths(null)).toEqual([]);
    expect(getAllParentPaths('')).toEqual([]);
    expect(getAllParentPaths('sites')).toEqual([]);
    expect(getAllParentPaths('sites/SSF2/areas')).toEqual([]);
  });

  it('returns an array containing all the parent paths', () => {
    expect(getAllParentPaths('sites/SSF2')).toEqual([]);
    expect(getAllParentPaths('sites/SSF2/areas/SierraVerticalGrow')).toEqual(['sites/SSF2']);
    expect(getAllParentPaths('sites/SSF2/areas/SierraVerticalGrow/lines/GrowRoom')).toEqual([
      'sites/SSF2',
      'sites/SSF2/areas/SierraVerticalGrow',
    ]);
    expect(getAllParentPaths('sites/SSF2/areas/SierraVerticalGrow/lines/GrowRoom/machines/Dehumidifer1')).toEqual([
      'sites/SSF2',
      'sites/SSF2/areas/SierraVerticalGrow',
      'sites/SSF2/areas/SierraVerticalGrow/lines/GrowRoom',
    ]);
    expect(
      getAllParentPaths(
        'sites/SSF2/areas/SierraVerticalGrow/lines/GrowRoom/machines/Dehumidifer1/deviceLocations/Camera1'
      )
    ).toEqual([
      'sites/SSF2',
      'sites/SSF2/areas/SierraVerticalGrow',
      'sites/SSF2/areas/SierraVerticalGrow/lines/GrowRoom',
      'sites/SSF2/areas/SierraVerticalGrow/lines/GrowRoom/machines/Dehumidifer1',
    ]);
  });
});
