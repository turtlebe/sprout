import { cols } from '../../results-page/table-cols';

import { shouldShowColumn } from './should-show-column';

describe('shouldShowColumn()', () => {
  const sampleTypes = ['Nutrient Analysis'];
  it('returns true when Lab Provider column has Novacrop value', () => {
    expect(shouldShowColumn(cols.PROVIDER_SAMPLE_ID, sampleTypes, 'Novacrop')).toBeTruthy();
  });

  it('returns false when Lab Provider column does not have Novacrop value', () => {
    expect(shouldShowColumn(cols.PROVIDER_SAMPLE_ID, sampleTypes, 'Anresco')).toBeFalsy();
  });
});
