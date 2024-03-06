import {
  mockMapsStateWithLoadDataLastLoadOperation,
  mockMapsStateWithLoadDataMaterialAttributes,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { DateTime } from 'luxon';

import { filterMapsStateForAgeCohort } from '.';

describe('filterMapsStateForAgeCohort', () => {
  it('returns all maps state when ageCohortDate is all', () => {
    expect(filterMapsStateForAgeCohort(mockMapsStateWithLoadDataMaterialAttributes, 'all')).toEqual(
      mockMapsStateWithLoadDataMaterialAttributes
    );
  });

  it('should filter down to map state matching to specific selected age cohort date (load date in materialAttributes)', () => {
    // ARRANGE
    const selectedAgeCohortDate = DateTime.fromISO('2021-02-11T00:10:36.582Z').toJSDate();

    // ACT
    const result = filterMapsStateForAgeCohort(mockMapsStateWithLoadDataMaterialAttributes, selectedAgeCohortDate);

    // ASSERT
    expect(Object.keys(result).length).toEqual(1);
    expect(result['1143ff3f-f807-4d47-a2af-31013e1d81fa:containerLocation-Bay7']).toBeDefined();
  });

  it('should filter down to map state matching to specific selected age cohort date (load date in lastLoadOperation)', () => {
    // ARRANGE
    const selectedAgeCohortDate = DateTime.fromISO('2021-02-11T00:10:36.582Z').toJSDate();

    // ACT
    const result = filterMapsStateForAgeCohort(mockMapsStateWithLoadDataLastLoadOperation, selectedAgeCohortDate);

    // ASSERT
    expect(Object.keys(result).length).toEqual(1);
    expect(result['1143ff3f-f807-4d47-a2af-31013e1d81fa:containerLocation-Bay7']).toBeDefined();
  });
});
