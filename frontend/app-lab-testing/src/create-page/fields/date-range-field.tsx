import {
  DateRangeValue,
  DateRangePicker as PlentyDateRangePicker,
} from '@plentyag/brand-ui/src/components/date-range-picker';
import { makeStyles } from '@plentyag/brand-ui/src/material-ui/core';
import { FastField, FieldProps, getIn } from 'formik';
import React from 'react';

import { getDateFormat } from '../../common/utils/date-utils';

export interface DateRangePickerProps
  extends FieldProps,
    Omit<PlentyDateRangePicker, 'name' | 'value' | 'error' | 'onChange'> {}

const useStyles = makeStyles(theme => ({
  textHelper: {
    color: theme.palette.warning.main,
  },
}));

export function fieldToDatePicker({
  field,
  form: { isSubmitting, errors, setFieldValue },
  disabled,
  ...props
}: DateRangePickerProps): PlentyDateRangePicker {
  const fieldError = getIn(errors, field.name);

  return {
    ...props,
    ...field,
    error: !!fieldError,
    helperText: fieldError || props.helperText,
    disabled: disabled !== undefined ? disabled : isSubmitting,
    onChange(values: DateRangeValue) {
      setFieldValue(field.name, values);
    },
  };
}

export const MISSING_DATE_WARNING = 'Warning: Missing Harvest Date';
export const OLD_DATE_WARNING = 'Warning: Harvest Date is today or older';

export const DateRangeField: React.FC<{
  className: string;
  fieldName: string;
  label: string;
  harvestDates?: DateRangeValue;
  labSampleType: string;
  setWarning: LT.SetFormWarning;
  validate?: (value: any) => any;
  disabled: boolean;
}> = props => {
  const classes = useStyles({});
  const warningMissingField =
    !props.harvestDates && props.labSampleType && props.labSampleType.toLowerCase() === 'product'
      ? MISSING_DATE_WARNING
      : '';
  const warningOldDate = props.harvestDates && props.harvestDates.begin <= new Date() ? OLD_DATE_WARNING : '';
  const warningLabel = warningMissingField || warningOldDate;
  const hasWarning = !!warningLabel;

  const helperTextProps = hasWarning ? { className: classes.textHelper } : undefined;
  props.setWarning(props.fieldName, !!hasWarning);

  function shouldUpdate(prevProps, nextProps) {
    return (
      prevProps.hasWarning !== nextProps.hasWarning ||
      prevProps.name !== nextProps.name ||
      getIn(prevProps.formik.values, nextProps.name) !== getIn(nextProps.formik.values, nextProps.name) ||
      getIn(prevProps.formik.errors, nextProps.name) !== getIn(nextProps.formik.errors, nextProps.name) ||
      getIn(prevProps.formik.touched, nextProps.name) !== getIn(nextProps.formik.touched, nextProps.name) ||
      Object.keys(prevProps).length !== Object.keys(nextProps).length ||
      prevProps.formik.isSubmitting !== nextProps.formik.isSubmitting
    );
  }

  return (
    <FastField hasWarning={hasWarning} name={props.fieldName} validate={props.validate} shouldUpdate={shouldUpdate}>
      {fieldProps => {
        return (
          <PlentyDateRangePicker
            format={getDateFormat()}
            className={props.className}
            {...fieldToDatePicker({ ...fieldProps, disabled: props.disabled })}
            helperText={warningLabel}
            FormHelperTextProps={helperTextProps}
          />
        );
      }}
    </FastField>
  );
};
