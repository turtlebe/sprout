import { getPackagingLotName } from './get-packaging-lot-name';

describe('getPackagingLotName', () => {
  it('builds packaging lot names correctly', () => {
    expect(getPackagingLotName('LAX1', 'B11', new Date(2022, 0, 1))).toBe('5-LAX1-B11-1');
    expect(getPackagingLotName('LAX1', 'B11', new Date(2022, 0, 10))).toBe('5-LAX1-B11-10');
    expect(getPackagingLotName('LAX1', 'B11', new Date(2022, 1, 1))).toBe('5-LAX1-B11-32');
    expect(getPackagingLotName('LAX1', 'B11', new Date(2023, 0, 1))).toBe('6-LAX1-B11-1');
  });
});
