import { getIn } from 'formik';
import { get, isEqual } from 'lodash';
import React from 'react';

import { isGroupFieldArray } from '../../../utils';

export const memoWithFormikProps = <T extends FormGen.Field, E = {}>(
  Component: React.FC<FormGen.FieldProps<T> & E>
) => {
  return React.memo(Component, (prevProps, nextProps) => {
    return (
      isEqual(prevProps.formikProps.initialValues, nextProps.formikProps.initialValues) &&
      isEqual(
        getIn(prevProps.formikProps.values, prevProps.formGenField.name),
        getIn(nextProps.formikProps.values, nextProps.formGenField.name)
      ) &&
      isEqual(
        getIn(prevProps.formikProps.errors, prevProps.formGenField.name),
        getIn(nextProps.formikProps.errors, nextProps.formGenField.name)
      ) &&
      isEqual(prevProps.formGenField, nextProps.formGenField)
    );
  });
};

export const memoGroupWithFormikProps = <
  T extends FormGen.FieldGroupArray | FormGen.FieldGroupFunction,
  E extends { groupIndex: number }
>(
  Component: React.FC<FormGen.FieldProps<T> & E>
) => {
  return React.memo(Component, (prevProps, nextProps) => {
    if (
      !isEqual(prevProps.formGenField, nextProps.formGenField) ||
      !isEqual(prevProps.formikProps.initialValues, nextProps.formikProps.initialValues)
    ) {
      return false;
    }

    if (isGroupFieldArray(nextProps.formGenField)) {
      return (
        isEqual(
          getIn(prevProps.formikProps.values, prevProps.formGenField.name),
          getIn(nextProps.formikProps.values, nextProps.formGenField.name)
        ) &&
        isEqual(
          getIn(prevProps.formikProps.errors, prevProps.formGenField.name),
          getIn(nextProps.formikProps.errors, nextProps.formGenField.name)
        )
      );
    }

    const { groupIndex } = nextProps;
    const prevGroupLength = get(prevProps.formikProps.values, `${prevProps.formGenField.name}.length`);
    const nextGroupLength = get(nextProps.formikProps.values, `${nextProps.formGenField.name}.length`);

    return (
      prevProps.groupIndex === nextProps.groupIndex &&
      prevGroupLength === nextGroupLength &&
      isEqual(
        get(prevProps.formikProps.values, `${prevProps.formGenField.name}[${groupIndex}]`),
        get(nextProps.formikProps.values, `${nextProps.formGenField.name}[${groupIndex}]`)
      ) &&
      isEqual(
        get(prevProps.formikProps.errors, `${prevProps.formGenField.name}[${groupIndex}]`),
        get(nextProps.formikProps.errors, `${nextProps.formGenField.name}[${groupIndex}]`)
      )
    );
  });
};
