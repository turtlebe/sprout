import { mockGenealogyData } from '../use-genealogy/mock-genealogy-data';
import { mockGenealogyDataWithExtraAntecedents } from '../use-genealogy/mock-genealogy-data-extra-antecents';

import { getChartRange } from './get-chart-range';

describe('getChartRange', () => {
  it('has correct start and end date from mock data', () => {
    const range = getChartRange(mockGenealogyData);
    expect(range.x.startDate).toEqual(new Date('2020-11-27T02:38:03.183Z'));
    expect(range.x.endDate).toEqual(new Date('2020-12-16T07:23:48.801Z'));
  });

  it('has end index of 10 when end index (2) is less than max 10', () => {
    const range = getChartRange(mockGenealogyData);
    expect(range.y.startIndex).toBe(0);
    expect(range.y.endIndex).toBe(10);
  });

  it('has correct start and end index', () => {
    const range = getChartRange(mockGenealogyDataWithExtraAntecedents);
    expect(range.y.startIndex).toBe(0);
    expect(range.y.endIndex).toBe(12);
  });
});
