import { mocksResourcesState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';

import { doesResourceHaveMatchingCrop } from '.';

const resourceWithBac = mocksResourcesState[0];
const resourceWithBacAndWhc = mocksResourcesState[2];
const cleanTable = mocksResourcesState[3];

describe('doesResourceHaveMatchingCrop', () => {
  it('returns true when there are no crops - as filter is empty', () => {
    expect(doesResourceHaveMatchingCrop(resourceWithBac, [])).toBe(true);
    expect(doesResourceHaveMatchingCrop(resourceWithBac, undefined)).toBe(true);
    expect(doesResourceHaveMatchingCrop(resourceWithBac, null)).toBe(true);
  });

  it('returns false when the resource has no crops', () => {
    expect(doesResourceHaveMatchingCrop(cleanTable, ['BAC', 'WHC'])).toBe(false);
  });

  it('returns true if there are matching crops', () => {
    expect(doesResourceHaveMatchingCrop(resourceWithBac, ['BAC', 'WHC'])).toBe(true);
    expect(doesResourceHaveMatchingCrop(resourceWithBacAndWhc, ['BAC', 'WHC'])).toBe(true);
    expect(doesResourceHaveMatchingCrop(resourceWithBacAndWhc, ['WHC'])).toBe(true);
    expect(doesResourceHaveMatchingCrop(resourceWithBacAndWhc, ['BAC'])).toBe(true);
  });

  it('returns false when there are no matching crops', () => {
    expect(doesResourceHaveMatchingCrop(resourceWithBac, ['CRC', 'WHC'])).toBe(false);
    expect(doesResourceHaveMatchingCrop(resourceWithBacAndWhc, ['CRC'])).toBe(false);
  });
});
