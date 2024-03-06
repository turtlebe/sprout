import { ValueFormatterParams, ValueSetterParams } from '@ag-grid-community/core';
import { get } from 'lodash';
import * as yup from 'yup';

/**
 * AgGrid re-usable colDef attributes
 */

export const cropValueFormatter = (params: ValueFormatterParams) => {
  const cropObject = get(params, `context.visData.varietals.${params.value}`, undefined);
  return cropObject ? `${cropObject.crop} ${params.value}` : params.value ?? '';
};

export const numberValueSetter = (params: ValueSetterParams) => {
  const field = params.colDef.field;
  params.data[field] = params.newValue || null;
  return true;
};

/**
 * Pre-defined yup validators
 */

export const validateOptionalDecimal = yup.number().min(0).nullable().typeError('Invalid number.');

export const validateOptionalInteger = yup.number().min(0).integer().nullable().typeError('Invalid number.');

export const validateYearMonthDayString = yup
  .string()
  .matches(
    /^20\d{2}-(0\d|1[0-2])-([0-2]\d|30|31)$/,
    'Invalid date format. Please enter the date in the format YYYY-MM-DD.'
  );
