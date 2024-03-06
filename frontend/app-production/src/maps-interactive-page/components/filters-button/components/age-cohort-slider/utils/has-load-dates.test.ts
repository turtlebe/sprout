import {
  mockMapsState,
  mockMapsStateWithLoadDataLastLoadOperation,
  mockMapsStateWithLoadDataMaterialAttributes,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';

import { hasLoadDates } from './has-load-dates';

describe('hasLoadDates', () => {
  it('should return true if mapsState has a loadOperationDate', () => {
    const result = hasLoadDates(mockMapsStateWithLoadDataLastLoadOperation);
    expect(result).toBeTruthy();
  });

  it('should return true if mapsState has a load date in materialAttributes', () => {
    const result = hasLoadDates(mockMapsStateWithLoadDataMaterialAttributes);
    expect(result).toBeTruthy();
  });

  it('should return false if mapsState does not have a loadOperationDate nor load date in materialAttributes', () => {
    const result = hasLoadDates(mockMapsState);
    expect(result).toBeFalsy();
  });
});
