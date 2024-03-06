import {
  isComputedField,
  isConcreteField,
  isConditionalField,
  isGroupField,
  isGroupFieldFunction,
  isWhenObject,
} from '@plentyag/brand-ui/src/components/form-gen/utils';
import { get, times } from 'lodash';
import React from 'react';
import * as yup from 'yup';

/**
 * Return a yup validation schema for a regular FormGen.Field.
 *
 * If the field does not have a validate property, it will default to yup.mixed().notRequired().
 *
 * @param field
 */
const getValidationSchemaForField = (field: FormGen.Field) => {
  if (field.validate) {
    if (field.label) {
      return field.validate.label(field.label);
    }

    return field.validate;
  }

  return yup.mixed().notRequired();
};

/**
 * When a FieldIf uses the `when` syntax, the validation of the nestedField will be nested under a yup.when() callback.
 * This makes sure to run the validation only when the if statement of the FieldIf is true.
 *
 * @param fieldIf
 * @param nestedField
 */
const getValidationSchemaForFieldIf = (
  fieldIf: FormGen.FieldIf,
  nestedField: FormGen.Field,
  accumulator: any
): yup.Schema<unknown> => {
  if (isWhenObject(fieldIf.if)) {
    const { keys, callback } = fieldIf.if;
    // if the schema already contains a validation on this field, we simply add to it instead of overriding it.
    if (accumulator[nestedField.name]) {
      return accumulator[nestedField.name].when(keys, { is: callback, then: getValidationSchemaForField(nestedField) });
    } else {
      return yup.mixed().when(keys, {
        is: callback,
        then: getValidationSchemaForField(nestedField),
      });
    }
  }

  return getValidationSchemaForField(nestedField);
};

interface FieldValidationAccumulator {
  [fieldName: string]: yup.Schema<unknown>;
}

/**
 * Parse the FormGen.Fields and return a yup validation schema.
 *
 * @param fields
 */
export const useValidationSchema = (fields: FormGen.FieldAny[], formikValues: any = {}) => {
  const validationSchemaReducer = (accumulator: FieldValidationAccumulator, field: FormGen.FieldAny): any => {
    if (isConditionalField(field)) {
      field.fields.forEach(nestedField => {
        if (isConcreteField(nestedField)) {
          accumulator[nestedField.name] = getValidationSchemaForFieldIf(field, nestedField, accumulator);
        } else if (isGroupFieldFunction(nestedField)) {
          validationSchemaReducer(accumulator, nestedField);
        }
      });
    } else if (isComputedField(field)) {
      field.computed(formikValues).forEach(computedField => validationSchemaReducer(accumulator, computedField));
    } else if (isGroupField(field)) {
      if (isGroupFieldFunction(field)) {
        const groupFieldAccumulator: FieldValidationAccumulator = {};
        const length = get(formikValues, `${field.name}.length`, 1);
        times(length).forEach(i =>
          field.fields(i).forEach(fieldInGroup => validationSchemaReducer(groupFieldAccumulator, fieldInGroup))
        );
        accumulator[field.name] = yup.array().of(yup.object().shape(groupFieldAccumulator));
      } else {
        const groupFieldAccumulator: FieldValidationAccumulator = {};
        field.fields.forEach(fieldInGroup => validationSchemaReducer(groupFieldAccumulator, fieldInGroup));
        accumulator[field.name] = yup.object().shape(groupFieldAccumulator);
      }
    } else {
      accumulator[field.name] = getValidationSchemaForField(field);
    }

    return accumulator;
  };

  const schema = React.useMemo(() => fields.reduce<any>(validationSchemaReducer, {}), [formikValues, fields]);

  return yup.object().shape(schema);
};
