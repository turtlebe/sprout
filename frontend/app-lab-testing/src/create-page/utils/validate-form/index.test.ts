import { mockLabTestTypes } from '@plentyag/app-lab-testing/src/common/test-helpers/mock-lab-test-types';
import { mockSample } from '@plentyag/app-lab-testing/src/common/test-helpers/mock-sample';
import { cloneDeep } from 'lodash';

import { ERROR_LAB_PROVIDERS_NOT_ALL_SAME, ERROR_REQUIRED, ERROR_SAMPLE_TYPES_NOT_ALL_SAME } from '../validate-field';

import { validateForm } from '.';

describe('validateForm', () => {
  it('returns validation error when required fields (sampleType and labTestProvider) are missing', () => {
    const _mockSample = cloneDeep(mockSample);
    _mockSample.sampleType = '';
    _mockSample.labTestProvider = '';

    const values = {
      items: [_mockSample],
    };
    expect(validateForm(values, mockLabTestTypes)).toEqual({
      items: [
        {
          sampleType: ERROR_REQUIRED,
          labTestProvider: ERROR_REQUIRED,
        },
      ],
    });
  });

  it('returns validation error when labTestProvider is not the same across all rows', () => {
    const mockSampleIEH = cloneDeep(mockSample);
    mockSampleIEH.labTestProvider = 'IEH';

    const values = {
      items: [mockSample, mockSampleIEH],
    };
    expect(validateForm(values, mockLabTestTypes)).toEqual({
      items: [
        {
          labTestProvider: ERROR_LAB_PROVIDERS_NOT_ALL_SAME,
        },
        {
          labTestProvider: ERROR_LAB_PROVIDERS_NOT_ALL_SAME,
        },
      ],
    });
  });

  it('returns validation error when sampleType is not the same across all rows', () => {
    const mockSampleTypeSeed = cloneDeep(mockSample);
    mockSampleTypeSeed.sampleType = 'Seed';

    const values = {
      items: [mockSample, mockSampleTypeSeed],
    };
    expect(validateForm(values, mockLabTestTypes)).toEqual({
      items: [
        {
          sampleType: ERROR_SAMPLE_TYPES_NOT_ALL_SAME,
        },
        {
          sampleType: ERROR_SAMPLE_TYPES_NOT_ALL_SAME,
        },
      ],
    });
  });

  it('retuns empty object when there are no errors', () => {
    const values = {
      items: [mockSample, mockSample],
    };
    expect(validateForm(values, mockLabTestTypes)).toEqual({});
  });
});
