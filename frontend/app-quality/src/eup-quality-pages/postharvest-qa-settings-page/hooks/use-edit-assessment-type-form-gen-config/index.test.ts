import {
  CREATE_ASSESSMENT_TYPE_URL,
  UPDATE_ASSESSMENT_TYPE_URL,
} from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { ValueType } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/types';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { renderHook } from '@testing-library/react-hooks';

import { useEditAssessmentTypeFormGenConfig } from '.';

describe('useEditAssessmentTypeFormGenConfig', () => {
  const mockUsername = 'bishopthesprinkler';
  const mockAssessmentTypeId = '123-abc';

  function renderUseEditAssessmentTypeFormGenConfig(
    options = {
      username: mockUsername,
    }
  ) {
    return renderHook(() => useEditAssessmentTypeFormGenConfig(options));
  }

  it('renders correct config for new assessment type', () => {
    // ACT
    const { result } = renderUseEditAssessmentTypeFormGenConfig();

    // ASSERT
    expect(result.current).toEqual(
      expect.objectContaining({
        title: 'New Assessment Type',
        createEndpoint: CREATE_ASSESSMENT_TYPE_URL,
        serialize: expect.anything(),
        deserialize: expect.anything(),
        fields: [
          expect.objectContaining({
            type: 'TextField',
            name: 'name',
            label: 'Name (machine name)',
          }),

          expect.objectContaining({
            type: 'TextField',
            name: 'label',
            label: 'Label (human display name)',
          }),
          expect.objectContaining({
            type: 'Select',
            name: 'valueType',
            label: 'Value Type',
            options: Object.values(ValueType),
          }),
          expect.objectContaining({
            type: 'TextField',
            name: 'validation',
            label: 'Validation',
            textFieldProps: {
              multiline: true,
              rows: 8,
            },
          }),
          expect.objectContaining({
            type: 'TextField',
            name: 'instructions',
            label: 'Instructions',
            textFieldProps: {
              multiline: true,
              rows: 8,
            },
          }),
          expect.objectContaining({
            type: 'TextField',
            name: 'uiOrder',
            label: 'Order',
            textFieldProps: {
              disabled: true,
            },
          }),
        ],
        permissions: {
          create: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
          update: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
        },
      })
    );
  });

  it('renders correct config for edit assessment type if assessment type ID is provided', () => {
    // ARRANGE
    const options = {
      username: mockUsername,
      assessmentTypeId: mockAssessmentTypeId,
    };

    // ACT
    const { result } = renderUseEditAssessmentTypeFormGenConfig(options);

    // ASSERT
    expect(result.current).toEqual(
      expect.objectContaining({
        title: 'Edit Assessment Type',
        updateEndpoint: `${UPDATE_ASSESSMENT_TYPE_URL}/${mockAssessmentTypeId}`,
        serialize: expect.anything(),
        deserialize: expect.anything(),
        fields: [
          expect.objectContaining({
            type: 'TextField',
            name: 'name',
            label: 'Name (machine name)',
          }),
          expect.objectContaining({
            type: 'TextField',
            name: 'label',
            label: 'Label (human display name)',
          }),
          expect.objectContaining({
            type: 'Select',
            name: 'valueType',
            label: 'Value Type',
            options: Object.values(ValueType),
          }),
          expect.objectContaining({
            type: 'TextField',
            name: 'validation',
            label: 'Validation',
            textFieldProps: {
              multiline: true,
              rows: 8,
            },
          }),
          expect.objectContaining({
            type: 'TextField',
            name: 'instructions',
            label: 'Instructions',
            textFieldProps: {
              multiline: true,
              rows: 8,
            },
          }),
          expect.objectContaining({
            type: 'TextField',
            name: 'uiOrder',
            label: 'Order',
            textFieldProps: {
              disabled: true,
            },
          }),
        ],
        permissions: {
          create: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
          update: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
        },
      })
    );
  });

  describe('validation', () => {
    const objectFields = ['validation', 'instructions'];

    it.each(objectFields)('errors "%s" field with invalid value', async designatedField => {
      // ARRANGE
      const { result } = renderUseEditAssessmentTypeFormGenConfig();
      const validationField: FormGen.FieldDefinition = (result.current.fields as FormGen.FieldDefinition[]).find(
        field => field.name === designatedField
      );

      // ACT
      try {
        await validationField.validate.validate('invalid');
      } catch (error) {
        // ASSERT
        expect(error.name).toEqual('ValidationError');
      }

      expect.assertions(1);
    });

    it.each(objectFields)('validates "%s" field with valid value', async designatedField => {
      // ARRANGE
      const { result } = renderUseEditAssessmentTypeFormGenConfig();
      const validationField: FormGen.FieldDefinition = (result.current.fields as FormGen.FieldDefinition[]).find(
        field => field.name === designatedField
      );

      // ACT 1
      const validated = await validationField.validate.validate('{}');

      // ASSERT
      expect(validated).toBeTruthy();
    });
  });

  describe('serialize/deseriaize', () => {
    it('serializes correctly (creating)', () => {
      // ARRANGE
      const { result } = renderUseEditAssessmentTypeFormGenConfig();

      const mockValues = {
        name: 'tubWeight',
        label: 'Tub Weight (oz)',
        valueType: 'FLOAT',
        validation: '{"min":0,"max":10,"required":true}',
        instructions: '{ "tooltip": "5% of the total number of tubs to be inspected in CPT." }',
        uiOrder: 1,
      };

      // ACT
      const serialized = result.current.serialize(mockValues);

      // ASSERT
      expect(serialized).toEqual({
        name: 'tubWeight',
        createdBy: mockUsername,
        label: 'Tub Weight (oz)',
        valueType: 'FLOAT',
        validation: { min: 0, max: 10, required: true },
        instructions: { tooltip: '5% of the total number of tubs to be inspected in CPT.' },
        uiOrder: 1,
      });
    });

    it('serializes correctly (updating)', () => {
      // ARRANGE
      const options = {
        username: mockUsername,
        assessmentTypeId: mockAssessmentTypeId,
      };

      const { result } = renderUseEditAssessmentTypeFormGenConfig(options);

      const mockValues = {
        name: 'tubWeight',
        label: 'Tub Weight (oz)',
        valueType: 'FLOAT',
        validation: '{"min":0,"max":10,"required":true}',
        instructions: '{ "tooltip": "5% of the total number of tubs to be inspected in CPT." }',
        uiOrder: 1,
      };

      // ACT
      const serialized = result.current.serialize(mockValues);

      // ASSERT
      expect(serialized).toEqual({
        name: 'tubWeight',
        updatedBy: mockUsername,
        label: 'Tub Weight (oz)',
        valueType: 'FLOAT',
        validation: { min: 0, max: 10, required: true },
        instructions: { tooltip: '5% of the total number of tubs to be inspected in CPT.' },
        uiOrder: 1,
      });
    });

    it('deserializes correctly', () => {
      // ARRANGE
      const options = {
        username: mockUsername,
        assessmentTypeId: mockAssessmentTypeId,
      };

      const { result } = renderUseEditAssessmentTypeFormGenConfig(options);

      const mockValues = {
        name: 'tubWeight',
        updatedBy: mockUsername,
        label: 'Tub Weight (oz)',
        valueType: 'FLOAT',
        validation: { min: 0, max: 10, required: true },
        instructions: { tooltip: '5% of the total number of tubs to be inspected in CPT.' },
        uiOrder: 1,
      };

      // ACT
      const deserialized = result.current.deserialize(mockValues);

      // ASSERT
      expect(deserialized).toEqual({
        name: 'tubWeight',
        updatedBy: mockUsername,
        label: 'Tub Weight (oz)',
        valueType: 'FLOAT',
        validation: '{\n  "min": 0,\n  "max": 10,\n  "required": true\n}',
        instructions: '{\n  "tooltip": "5% of the total number of tubs to be inspected in CPT."\n}',
        uiOrder: 1,
      });
    });
  });
});
