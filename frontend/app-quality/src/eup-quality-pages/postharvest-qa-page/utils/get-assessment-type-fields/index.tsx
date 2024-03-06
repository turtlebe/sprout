import '@plentyag/core/src/yup/extension';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import * as yup from 'yup';

import { AssessmentTypes, ValueType } from '../../types';
import { getAssessmentTypeSingleChoiceOptions } from '../get-assessment-type-single-choice-options';
import { getAssessmentTypeTitle } from '../get-assessment-type-title';
import { getTooltipComponent } from '../get-tooltip-component';

type CompatibleFields =
  | FormGen.Field
  | FormGen.FieldTextField
  | FormGen.FieldKeyboardDateTimePicker
  | FormGen.FieldRadioGroup;

export const getAssessmentTypeFields = (assessmentTypes: AssessmentTypes[], values: any): CompatibleFields[] => {
  return assessmentTypes.map(assessmentType => {
    const { name } = assessmentType;
    const { required } = assessmentType.validation;

    const label = getAssessmentTypeTitle(assessmentType, values);

    // configure tooltip instructions
    let tooltip;
    if (assessmentType?.instructions?.tooltip) {
      tooltip = getTooltipComponent(label, assessmentType.instructions.tooltip);
    }

    // base field config
    const field = {
      name,
      label,
      tooltip,
      sortOptionsByLabel: false,
    };

    switch (assessmentType.valueType) {
      case ValueType.FLOAT: {
        const { min, max } = assessmentType.validation;

        // -- type
        let validate = yup.number();

        // -- required
        validate = required ? validate.required() : validate.optional().nullable();

        // -- set min/max values
        if (min !== undefined && min !== null) {
          validate = validate.min(min);
        }
        if (max !== undefined && max !== null) {
          validate = validate.max(max);
        }

        return {
          ...field,
          type: 'TextField',
          validate,
          textFieldProps: { type: 'number' },
        };
      }
      case ValueType.FLOAT_CHOICE: {
        const min = Math.min(
          ...assessmentType.validation.choicethresholds.map(
            choicethreshold => choicethreshold.discriminate.validation.min
          )
        );
        const max = Math.max(
          ...assessmentType.validation.choicethresholds.map(
            choicethreshold => choicethreshold.discriminate.validation.max
          )
        );

        // -- type
        let validate = yup.number();

        // -- required
        validate = required ? validate.required() : validate.optional().nullable();

        // -- set min/max values
        if (min !== undefined && min !== null) {
          validate = validate.min(min);
        }
        if (max !== undefined && max !== null) {
          validate = validate.max(max);
        }

        return {
          ...field,
          type: 'TextField',
          validate,
          textFieldProps: { type: 'number' },
        };
      }
      case ValueType.SINGLE_CHOICE: {
        // -- options
        const options = getAssessmentTypeSingleChoiceOptions(assessmentType, values);

        // -- type
        let validate = yup.string().nullable();

        // -- required
        validate = required ? validate.required() : validate.optional().nullable();

        return {
          ...field,
          type: 'RadioGroup',
          options,
          validate,
        };
      }
      case ValueType.DATE_TIME: {
        const { minDateTime, maxDateTime } = assessmentType.validation;

        // -- type
        let validate = yup.date();

        // -- required
        validate = required ? validate.required() : validate.optional().nullable();

        // -- min/maxlength
        let minDate, maxDate;
        if (minDateTime !== undefined) {
          minDate = DateTime.fromISO(minDateTime).toJSDate();
          validate = validate.min(minDate);
        }
        if (maxDateTime !== undefined) {
          maxDate = DateTime.fromISO(maxDateTime).toJSDate();
          validate = validate.max(maxDate);
        }

        switch (assessmentType.validation?.format) {
          case 'TIME_WITH_SECONDS': {
            return {
              ...field,
              type: 'KeyboardTimePicker',
              validate,
              keyboardTimePickerProps: {
                views: ['hours', 'minutes', 'seconds'],
                format: DateTimeFormat.US_TIME_WITH_SECONDS,
                placeholder: DateTime.now().toFormat(DateTimeFormat.US_TIME_WITH_SECONDS),
                minDate,
                maxDate,
              },
            };
          }

          default: {
            return {
              ...field,
              type: 'KeyboardDateTimePicker',
              validate,
              keyboardDateTimePickerProps: {
                minDate,
                maxDate,
              },
            };
          }
        }
      }
      case ValueType.TEXT:
      default: {
        const { minLength, maxLength } = assessmentType.validation;

        // -- type
        let validate = yup.string();

        // -- required
        validate = required ? validate.required() : validate.optional().nullable();

        // -- min/maxlength
        if (minLength !== undefined) {
          validate = validate.min(minLength);
        }
        if (maxLength !== undefined) {
          validate = validate.max(maxLength);
        }

        return {
          ...field,
          type: 'TextField',
          validate,
        };
      }
    }
  });
};
