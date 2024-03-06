import { difference } from 'lodash';
import * as yup from 'yup';

export interface ValidateRadioGridValuesOptions {
  allowedValues: string[];
  length: number;
}

export interface ValidateTextFieldGridValuesOptions {
  keys: string[];
  length: number;
}

export interface ValidateTextFieldGridValuesUsingFunctionOpitons {
  errorMessage: string;
  gridValueTestFunction: (gridValue: any) => boolean;
}

export const ERROR_MESSAGES = {
  validateRadioGridValues: 'All the columns must be checked',
  validateTextFieldGridValues: 'All inputs are required',
  validateDragAndDrop: 'You must upload at least one file',
};

function requireSeedlingTableColumn(this: yup.MixedSchema, columnDefField: string) {
  return this.test('requireSeedlingTableColumn', null, function (plugs) {
    const { path, createError } = this;
    const isValid =
      Array.isArray(plugs) &&
      plugs.every((plug, index) => {
        // this is the "other" plugs and does not count as part of `columnDefField`.
        if (index === plugs.length - 1) {
          return true;
        }
        const property = plug.properties.find(property => property.name === columnDefField);
        return property.value !== null && property.value !== undefined;
      });
    return isValid || createError({ path, message: `${columnDefField} is a required field` });
  });
}

function validateRadioGridValues(this: yup.MixedSchema, options: ValidateRadioGridValuesOptions) {
  return this.test('validateRadioGridValues', null, function (radioGridValues) {
    const { path, createError } = this;
    const isValid =
      Array.isArray(radioGridValues) &&
      radioGridValues.length === options.length &&
      radioGridValues.every(value => options.allowedValues.includes(value));
    return isValid || createError({ path, message: ERROR_MESSAGES.validateRadioGridValues });
  });
}

function validateTextFieldGridValues(this: yup.MixedSchema, options: ValidateTextFieldGridValuesOptions) {
  return this.test('validateTextFieldGridValues', null, function (textFieldGridValues) {
    const { path, createError } = this;
    const isValid =
      textFieldGridValues &&
      typeof textFieldGridValues === 'object' &&
      difference(options.keys, Object.keys(textFieldGridValues)).length === 0 &&
      Object.keys(textFieldGridValues).every(key => {
        const values = textFieldGridValues[key];
        return Array.isArray(values) && values.length === options.length && values.every(value => value);
      });
    return isValid || createError({ path, message: ERROR_MESSAGES.validateTextFieldGridValues });
  });
}

function validateDragAndDrop(this: yup.MixedSchema) {
  return this.test('validateDragAndDrop', null, function (dragAndDropValues) {
    const { path, createError } = this;
    const isValid = dragAndDropValues && dragAndDropValues.length > 0;

    return isValid || createError({ path, message: ERROR_MESSAGES.validateDragAndDrop });
  });
}

function noDateTimeError(this: yup.StringSchema) {
  return this.test('noDateTimeError', '${path} is invalid.', function (string) {
    const { path, createError } = this;
    const isValid = string !== 'Invalid DateTime' && string !== 'Invalid date'; // // @deprecated with backwards compatibility with Moment
    return isValid || createError({ path });
  });
}

function noFutureDateTime(this: yup.StringSchema) {
  return this.test('noFutureDateTime', 'Setting time in the future is invalid', function (string) {
    const { createError } = this;
    const isValid = new Date(string) < new Date();
    return isValid || createError();
  });
}

function validateTextFieldGridValuesUsingFunction(
  this: yup.MixedSchema,
  options: ValidateTextFieldGridValuesUsingFunctionOpitons
) {
  return this.test('validateTextFieldGridValuesUsingFunction', null, function (textFieldGridValues) {
    const { path, createError } = this;
    const isValid =
      textFieldGridValues &&
      typeof textFieldGridValues === 'object' &&
      Object.keys(textFieldGridValues).every(key => {
        const values = textFieldGridValues[key];
        return Array.isArray(values) && values.every(options.gridValueTestFunction);
      });
    return isValid || createError({ path, message: options.errorMessage });
  });
}

/**
 * This yup number validator ensures the sum of the target ratios for sum to 1.
 */
function validateCropTargetRatio(this: yup.NumberSchema, targetRatios: number[]) {
  return this.test('cropTargetRatio', 'Sum of target ratios must be 1.', function (value) {
    // get index for current "value" that has been changed.
    let valueIndex;
    const match = /\[(\d+)\]/.exec(this.path);
    if (match && match[1]) {
      valueIndex = Number(match[1]);
    }
    let sum = 0;
    targetRatios.forEach((ratio, index) => {
      // if we find index for "value" then use this value in
      // place of current value in ratios, since updates for "ratios" lags.
      if (index === valueIndex && typeof value === 'number') {
        sum += value;
      } else if (typeof ratio === 'number') {
        sum += ratio;
      }
    });
    return Math.abs(sum - 1) <= Number.EPSILON;
  });
}

/**
 * A way to define a strict array of specific schema per index of that array
 * This was inspired by the "tuple" proposal here: https://github.com/jquense/yup/issues/1395
 *
 * Note: The new version of "yup" has "tuple", however, to use the latest, retrofitting the
 * current code is rather large TODO (jvu: 2023-03-09)
 *
 * @param this
 * @param schemas
 * @returns
 */
function validateTupleOf<T>(this: yup.ArraySchema<T>, schemas: yup.Schema<T>[]): yup.ArraySchema<T> {
  return this.test(
    'tuple-of',
    `Array should have the exact length of schemas: ${schemas.length}`,
    items => schemas.length === items.length
  ).test('tuple-of', 'Not all items in ${path} match one of the allowed schemas', items =>
    items.every((item, index) => {
      return schemas[index].isValidSync(item, { strict: true });
    })
  );
}

yup.addMethod<yup.MixedSchema>(yup.mixed, 'requireSeedlingTableColumn', requireSeedlingTableColumn);
yup.addMethod<yup.MixedSchema>(yup.mixed, 'validateRadioGridValues', validateRadioGridValues);
yup.addMethod<yup.MixedSchema>(yup.mixed, 'validateTextFieldGridValues', validateTextFieldGridValues);
yup.addMethod<yup.MixedSchema>(
  yup.mixed,
  'validateTextFieldGridValuesUsingFunction',
  validateTextFieldGridValuesUsingFunction
);
yup.addMethod<yup.MixedSchema>(yup.mixed, 'validateDragAndDrop', validateDragAndDrop);
yup.addMethod<yup.StringSchema>(yup.mixed, 'noDateTimeError', noDateTimeError);
yup.addMethod<yup.StringSchema>(yup.mixed, 'noMomentError', noDateTimeError); // @deprecated
yup.addMethod<yup.StringSchema>(yup.mixed, 'noFutureDateTime', noFutureDateTime);

yup.addMethod<yup.NumberSchema>(yup.number, 'cropTargetRatio', validateCropTargetRatio);

yup.addMethod<yup.ArraySchema<any>>(yup.array, 'tupleOf', validateTupleOf);
