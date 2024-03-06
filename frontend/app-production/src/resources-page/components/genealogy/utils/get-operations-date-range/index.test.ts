import { mockGenealogyData } from '../../hooks/use-genealogy/mock-genealogy-data';

import { getOperationsDateRange } from '.';

describe('getOperations', () => {
  it('will show exception if array is empty', () => {
    expect(() => getOperationsDateRange([])).toThrow();
  });

  it('gives proper start and end dates', () => {
    const range = getOperationsDateRange(mockGenealogyData.operations);
    expect(range.start).toEqual(new Date('2020-11-30T17:01:51.985Z'));
    expect(range.end).toEqual(new Date('2020-12-10T17:01:55.000Z'));
  });
});
