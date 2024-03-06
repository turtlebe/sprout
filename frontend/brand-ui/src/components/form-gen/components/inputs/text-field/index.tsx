import { TextField as MuiTextField, TextFieldProps } from '@plentyag/brand-ui/src/material-ui/core';
import { isKeyPressed } from '@plentyag/core/src/utils';
import React from 'react';

import { TEXT_FIELD_ENTER_EVENT } from '../../../constants';
import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export function parse(type: string, value: string): string | number {
  if (type === 'number') {
    const floatValue = parseFloat(value);
    return isNaN(floatValue) ? null : floatValue;
  }
  return value;
}

export const TextField = memoWithFormikProps<FormGen.FieldTextField>(({ formGenField, formikProps, ...props }) => {
  const textFieldRef = React.useRef<HTMLDivElement>(null);
  const { decorateLabel } = useIsRequired(formGenField);
  const { value, error, name, label } = useFormikProps(formikProps, formGenField);
  const textFieldProps = formGenField.textFieldProps as TextFieldProps;
  const type = textFieldProps?.type;
  const [internalValue, setInternalValue] = React.useState<string | number>(parse(type, value));
  if (textFieldProps?.inputProps?.type === 'hidden') {
    props.style = { ...props.style, display: 'none' };
  }

  function raiseEnterEvent() {
    const enterEvent = new CustomEvent(TEXT_FIELD_ENTER_EVENT, { bubbles: true });
    textFieldRef.current.dispatchEvent(enterEvent);
  }

  const handleChange: TextFieldProps['onChange'] = event => {
    const endsWithNewline = event.target.value.endsWith('\n');
    if (formGenField.addGroupOnNewLineOrReturn && endsWithNewline) {
      const strippedValue = event.target.value.trimEnd();
      setInternalValue(parse(event.target.type, strippedValue));
      formikProps.setFieldValue(name, strippedValue, true);
      raiseEnterEvent();
      return;
    }

    setInternalValue(parse(event.target.type, event.target.value));
  };

  const handleBlur: TextFieldProps['onBlur'] = () => formikProps.validateField(name);

  const handleKeyDown: TextFieldProps['onKeyDown'] = event => {
    const { isEnterPressed } = isKeyPressed(event);
    if (isEnterPressed && formGenField.addGroupOnNewLineOrReturn) {
      event.preventDefault();
      raiseEnterEvent();
    }
  };

  // Updates the formik values when the internalValue changes.
  React.useEffect(() => {
    formikProps.setFieldValue(name, internalValue);
  }, [internalValue]);

  // Calls validation and set internalValue when the prop value changes.
  React.useEffect(() => {
    if (value !== undefined && value !== null) {
      try {
        formikProps.validateField(name);
      } catch (error) {
        // @TODO: SD-12827
        // Since FormGen computed fields, we are potentially calling validateField before the yup validation schema
        // has had a chance to be re-calculated with the computed fields. Doing so will throw an error that this name/path
        // doesn't exist in the schema -> For now, swallow this error...
      }
    }
    setInternalValue(parse(type, value));
  }, [value]);

  // fix for https://plentyag.atlassian.net/browse/SD-16228, can be overriden by inputProps.
  const defaultStep = textFieldProps?.type === 'number' ? 'any' : undefined;

  return (
    <MuiTextField
      {...textFieldProps}
      ref={textFieldRef}
      inputProps={{ step: defaultStep, ...textFieldProps?.inputProps }}
      value={internalValue ?? ''}
      id={name}
      data-testid={name}
      name={name}
      error={Boolean(error)}
      helperText={error}
      label={decorateLabel(label)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      {...props}
    />
  );
});
