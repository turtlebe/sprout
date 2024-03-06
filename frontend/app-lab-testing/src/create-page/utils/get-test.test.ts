import { mockLabTestTypes } from '../../common/test-helpers/mock-lab-test-types';

import { getTests } from './get-tests';

describe('getTests()', () => {
  it('returns no matching tests when given labTestKind not in labTypeData', () => {
    const tests = getTests({
      labTypeData: mockLabTestTypes,
      labTestKind: 'Water Pathogen',
      labSampleType: 'Seed',
      labTestProvider: 'IEH',
    });
    expect(tests).toEqual([]);
  });

  it('returns no matching tests when given labTestKind not in labTypeData', () => {
    const tests = getTests({
      labTypeData: mockLabTestTypes,
      labTestKind: 'Water Pathogen',
      labSampleType: 'Seed',
      labTestProvider: 'IEH',
    });
    expect(tests).toEqual([]);
  });

  it('returns no matching tests when given labTestProvider not in labTypeData', () => {
    const tests = getTests({
      labTypeData: mockLabTestTypes,
      labTestKind: 'Human Pathogen',
      labSampleType: 'Seed',
      labTestProvider: 'Anresco',
    });
    expect(tests).toEqual([]);
  });

  it('returns list of tests when match found for kind, sampe type and provider', () => {
    const tests = getTests({
      labTypeData: mockLabTestTypes,
      labTestKind: 'Human Pathogen',
      labSampleType: 'Seed',
      labTestProvider: 'IEH',
    });
    expect(tests).toEqual([
      { name: 'APC', selected: true },
      { name: 'ECC', selected: true },
    ]);
  });
});
