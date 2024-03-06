import { mockAssessmentTypes, mockAssessmentTypesRecord } from '../../test-helpers/mock-assessment-types';

import { getAssessmentTypeFields } from '.';

describe('getAssessmentTypeFields', () => {
  it('should get assessmenty type fields based on validation rule (4oz weight from sku)', () => {
    // ARRANGE
    const values = {
      skuWeight: 4,
    };

    // ACT
    const results = getAssessmentTypeFields(mockAssessmentTypes, values);

    // ASSERT
    const fieldOne = results[0] as FormGen.FieldTextField;
    const fieldTwo = results[1] as FormGen.FieldTextField;
    const fieldThree = results[2] as FormGen.FieldRadioGroup;

    expect(fieldOne.name).toEqual('tubWeight');
    expect(fieldOne.label).toEqual('Tub Weight (oz)');
    expect(fieldOne.type).toEqual('TextField');
    expect(fieldOne.textFieldProps).toEqual({ type: 'number' });

    expect(fieldTwo.name).toEqual('notes');
    expect(fieldTwo.label).toEqual('Notes');
    expect(fieldTwo.type).toEqual('TextField');

    // Show the label override based on the validation rules in instructions
    expect(fieldThree.name).toEqual('largeLeaves');
    expect(fieldThree.label).toEqual('Large Leaves');
    expect(fieldThree.type).toEqual('RadioGroup');
    expect(fieldThree.options).toEqual([
      { value: 'PASS', label: '0-18 leaves' },
      { value: 'FAIL', label: '19+ leaves' },
    ]);
  });

  it('should get different assessment type field labels based on validation rule (8oz weight from sku)', () => {
    // ARRANGE
    const values = {
      skuWeight: 8,
    };

    // ACT
    const results = getAssessmentTypeFields(mockAssessmentTypes, values);

    // ASSERT
    const fieldThree = results[2] as FormGen.FieldRadioGroup; // field with different results

    // Show the label override based on the validation rules in instructions
    expect(fieldThree.name).toEqual('largeLeaves');
    expect(fieldThree.label).toEqual('Large Leaves');
    expect(fieldThree.type).toEqual('RadioGroup');
    expect(fieldThree.options).toEqual([
      { value: 'PASS', label: '0-37 leaves' },
      { value: 'FAIL', label: '38+ leaves' },
    ]);
  });

  describe('run correct validition', () => {
    let result;
    beforeEach(() => {
      result = getAssessmentTypeFields(mockAssessmentTypes, {});
    });

    describe('float value type', () => {
      let field;
      beforeEach(() => {
        field = result[0];
      });

      it('should flag for empty value if required', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate(null);
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should not flag for empty value if optional', async () => {
        // ARRANGE
        const assessmentType = mockAssessmentTypesRecord['tubWeight'];
        const mockOptionalAssessmentType = {
          ...assessmentType,
          validation: {
            ...assessmentType.validation,
            required: false,
          },
        };
        field = getAssessmentTypeFields([mockOptionalAssessmentType], {})[0];

        // ACT
        const validateResult1 = await field.validate.validate(null);
        const validateResult2 = await field.validate.validate(undefined);

        // ASSERT
        expect(validateResult1).toEqual(null);
        expect(validateResult2).toEqual(undefined);
      });

      it('should flag for less than min', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate(-1);
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should flag for larger than max', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate(12);
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });
    });

    describe('float choice value type', () => {
      let field;
      beforeEach(() => {
        field = result[6];
      });

      it('should flag for empty value if required', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate(null);
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should not flag for empty value if optional', async () => {
        // ARRANGE
        const assessmentType = mockAssessmentTypesRecord['tubWeightFloatChoice'];
        const mockOptionalAssessmentType = {
          ...assessmentType,
          validation: {
            ...assessmentType.validation,
            required: false,
          },
        };
        field = getAssessmentTypeFields([mockOptionalAssessmentType], {})[0];

        // ACT
        const validateResult1 = await field.validate.validate(null);
        const validateResult2 = await field.validate.validate(undefined);

        // ASSERT
        expect(validateResult1).toEqual(null);
        expect(validateResult2).toEqual(undefined);
      });

      it('should flag for less than min', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate(-1);
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should flag for larger than max', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate(12);
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });
    });

    describe('text value type', () => {
      let field;
      beforeEach(() => {
        field = result[1];
      });

      it('should not flag for empty value if optional', async () => {
        // ARRANGE
        const assessmentType = mockAssessmentTypesRecord['notes'];
        const mockOptionalAssessmentType = {
          ...assessmentType,
          validation: {
            ...assessmentType.validation,
            required: false,
          },
        };
        field = getAssessmentTypeFields([mockOptionalAssessmentType], {})[0];

        // ACT
        const validateResult1 = await field.validate.validate(null);
        const validateResult2 = await field.validate.validate(undefined);

        // ASSERT
        expect(validateResult1).toEqual(null);
        expect(validateResult2).toEqual(undefined);
      });

      it('should flag for length less than minLength', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate('bit');
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should flag for length larger than maxLength', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate('thisistoolongofasentencedude');
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });
    });

    describe('single choice value type', () => {
      let field;
      beforeEach(() => {
        field = result[2];
      });

      it('should flag for empty value if required', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate(null);
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should not flag for empty value if optional', async () => {
        // ARRANGE
        const assessmentType = mockAssessmentTypesRecord['largeLeaves'];
        const mockOptionalAssessmentType = {
          ...assessmentType,
          validation: {
            ...assessmentType.validation,
            required: false,
          },
        };
        field = getAssessmentTypeFields([mockOptionalAssessmentType], {})[0];

        // ACT
        const validateResult1 = await field.validate.validate(null);
        const validateResult2 = await field.validate.validate(undefined);

        // ASSERT
        expect(validateResult1).toEqual(null);
        expect(validateResult2).toEqual(undefined);
      });
    });

    describe('date time type', () => {
      let field;
      beforeEach(() => {
        field = result[4];
      });

      it('should flag for empty value if required', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate(null);
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should not flag for empty value if optional', async () => {
        // ARRANGE
        const assessmentType = mockAssessmentTypesRecord['timestamp'];
        const mockOptionalAssessmentType = {
          ...assessmentType,
          validation: {
            ...assessmentType.validation,
            required: false,
          },
        };
        field = getAssessmentTypeFields([mockOptionalAssessmentType], {})[0];

        // ACT
        const validateResult1 = await field.validate.validate(null);
        const validateResult2 = await field.validate.validate(undefined);

        // ASSERT
        expect(validateResult1).toEqual(null);
        expect(validateResult2).toEqual(undefined);
      });

      it('should flag for less than min date time', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate('2017-11-20T16:55:30.00Z');
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should flag for larger than max date time', async () => {
        // ACT & ASSERT
        try {
          await field.validate.validate('2025-11-20T16:55:30.00Z');
        } catch (e) {
          expect(e.name).toEqual('ValidationError');
        }
        expect.assertions(1);
      });

      it('should pass for data within range', async () => {
        // ARRANGE
        const date = '2020-11-20T16:55:30.00Z';

        // ACT
        const result = await field.validate.validate(date);

        // ASSERT
        expect(result).toEqual(new Date(date));
      });

      describe('TIME_WITH_SECONDS', () => {
        let field;
        beforeEach(() => {
          field = result[5];
        });

        it('should have the correct properties', () => {
          // ASSERT
          expect(field).toEqual(
            expect.objectContaining({
              type: 'KeyboardTimePicker',
              keyboardTimePickerProps: expect.objectContaining({
                views: ['hours', 'minutes', 'seconds'],
                format: 'hh:mm:ss a',
              }),
            })
          );
        });
      });
    });
  });
});
