import { cloneDeep } from 'lodash';

import { mockLabTestTypes } from '../../test-helpers/mock-lab-test-types';

import { allowDifferentSampleTypeCreation } from '.';

describe('allowDifferentSampleTypeCreation', () => {
  it('allows different sample type creation', () => {
    const _mockLabTestType = cloneDeep(mockLabTestTypes);
    _mockLabTestType[0].allowDifferentSampleTypeCreation = true;

    expect(allowDifferentSampleTypeCreation('IEH', _mockLabTestType)).toBe(true);
  });

  it('does not allow different sample type creation', () => {
    expect(allowDifferentSampleTypeCreation('IEH', mockLabTestTypes)).toBe(false);
  });
});
