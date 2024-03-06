import { getHasFarmColumns } from '.';

const mockFarms = ['Tigris', 'LAX1', 'LAR'];

describe('getHasFarmColumns', () => {
  it('has column for each farm', () => {
    const farmColumns = getHasFarmColumns('crop', mockFarms);

    expect(farmColumns).toHaveLength(mockFarms.length);

    expect(farmColumns.map(col => col.headerName)).toEqual(expect.arrayContaining(mockFarms));
  });

  it('has columns sorted by farm name', () => {
    const farmColumns = getHasFarmColumns('crop', mockFarms);
    expect(farmColumns[0].headerName).toBe(mockFarms[2]);
    expect(farmColumns[1].headerName).toBe(mockFarms[1]);
    expect(farmColumns[2].headerName).toBe(mockFarms[0]);
  });
});
