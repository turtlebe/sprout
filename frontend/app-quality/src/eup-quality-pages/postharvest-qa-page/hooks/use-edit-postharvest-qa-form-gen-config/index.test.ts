import {
  mockPackagingLots,
  mockPackagingLotsRecord,
  mockSkus,
  mockSkusRecord,
} from '@plentyag/core/src/test-helpers/mocks';
import { renderHook } from '@testing-library/react-hooks';

import { CREATE_POSTHARVEST_QA_AUDIT, UPDATE_POSTHARVEST_QA_AUDIT } from '../../constants';
import { mockAssessmentTypes } from '../../test-helpers/mock-assessment-types';
import { mockPostharvestQaAudits } from '../../test-helpers/mock-postharvest-qa-audits';

import { useEditPostharvestQaFormGenConfig } from '.';

describe('useEditPostharvestQaFormGenConfig', () => {
  function renderUseEditPostharvestQaFormGenConfig() {
    return renderHook(() =>
      useEditPostharvestQaFormGenConfig({
        lots: mockPackagingLots,
        lotsRecord: mockPackagingLotsRecord,
        skus: mockSkus,
        skusRecord: mockSkusRecord,
        assessmentTypes: mockAssessmentTypes,
        username: 'jvu',
        siteName: 'LAX1',
        farmName: 'LAX1',
      })
    );
  }

  it('returns correct FormGen config', () => {
    // ACT
    const { result } = renderUseEditPostharvestQaFormGenConfig();

    // ASSERT
    expect(result.current).toEqual(
      expect.objectContaining({
        title: 'New Audit',
        createEndpoint: CREATE_POSTHARVEST_QA_AUDIT,
        updateEndpoint: UPDATE_POSTHARVEST_QA_AUDIT,
        permissions: {
          create: { resource: 'HYP_QUALITY', level: 6 },
          update: { resource: 'HYP_QUALITY', level: 6 },
        },
      })
    );
  });

  it('returns correct fields', () => {
    // ARRANGE
    const { result } = renderUseEditPostharvestQaFormGenConfig();
    const [lotField, skuField, aseessmentFields] = result.current.fields;
    const mockValues = {
      lot: '5-LAX1-C11-219',
      tubWeight: 4.5,
    };

    // ASSERT 1
    expect((lotField as FormGen.FieldAutocomplete).options).toEqual([
      '5-LAX1-C11-219',
      '5-LAX1-C11-245',
      '5-LAX1-KC1-223',
    ]);

    // ACT 2
    const skuComputedField = (skuField as FormGen.FieldComputed).computed(mockValues);

    // ASSERT 2
    expect((skuComputedField as unknown as FormGen.FieldAutocomplete)[0].options).toEqual(['C11Case6Clamshell4o5oz']);

    // ACT 3
    const aseessmentComputedFields = (aseessmentFields as FormGen.FieldComputed).computed(mockValues);

    // ASSERT 3
    expect((aseessmentComputedFields[0] as FormGen.Field).name).toEqual('tubWeight');
    expect((aseessmentComputedFields[1] as FormGen.Field).name).toEqual('notes');
    expect((aseessmentComputedFields[2] as FormGen.Field).name).toEqual('largeLeaves');
  });

  it('serializes correctly', () => {
    // ARRANGE
    const { result } = renderUseEditPostharvestQaFormGenConfig();
    const mockValues = {
      originalModel: mockPostharvestQaAudits[0],
      lot: '5-LAX1-C11-219',
      sku: 'C11Case6Clamshell4o5oz',
      tubWeight: 4.0,
      notes: 'hello',
      largeLeaves: 'PASS',
      bestByDateCorrect: null,
    };

    // ACT
    const serialized = result.current.serialize(mockValues);

    // ASSERT
    expect(serialized).toEqual({
      id: '35d07805-6c54-4894-a2dc-00b0b3d3af45',
      createdAt: '2022-11-08T19:04:19.997128Z',
      createdBy: 'jvu',
      updatedAt: '2022-11-08T19:04:19.997128Z',
      updatedBy: 'bishopthesprinkler',
      assessments: [
        { name: 'tubWeight', value: 4 },
        { name: 'notes', value: 'hello' },
        { name: 'largeLeaves', value: 'PASS' },
      ],
      farm: 'LAX1',
      lot: '5-LAX1-C11-219',
      site: 'LAX1',
      sku: 'C11Case6Clamshell4o5oz',
    });
  });

  it('deserializes correctly', () => {
    // ARRANGE
    const { result } = renderUseEditPostharvestQaFormGenConfig();
    const mockValues = {
      id: '35d07805-6c54-4894-a2dc-00b0b3d3af45',
      createdAt: '2022-11-08T19:04:19.997128Z',
      createdBy: 'jvu',
      updatedAt: '2022-11-08T19:04:19.997128Z',
      updatedBy: 'bishopthesprinkler',
      assessments: [
        { name: 'tubWeight', value: 5 },
        { name: 'notes', value: 'hello' },
        { name: 'largeLeaves', value: 'PASS' },
        { name: 'bestByDateCorrect', value: undefined },
        { name: 'timestamp', value: undefined },
      ],
      farm: 'LAX1',
      lot: '5-LAX1-C11-219',
      site: 'LAX1',
      sku: 'C11Case6Clamshell4o5oz',
    };

    // ACT
    const deserialized = result.current.deserialize(mockValues);

    // ASSERT
    expect(deserialized).toEqual({
      originalModel: mockValues,
      lot: '5-LAX1-C11-219',
      sku: 'C11Case6Clamshell4o5oz',
      tubWeight: 5,
      notes: 'hello',
      largeLeaves: 'PASS',
      bestByDateCorrect: null,
      timestamp: null,
      timewithseconds: null,
      tubWeightFloatChoice: null,
    });
  });
});
