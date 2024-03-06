import { Add } from '@material-ui/icons';
import { useFormGenFields } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-gen-fields';
import { useFormStateContext } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-state-context';
import { isGroupFieldArray, isGroupFieldFunction } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { Box, FormHelperText, IconButton, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { cloneDeep, get, times } from 'lodash';
import React from 'react';
import { useEvent } from 'react-use';

import { TEXT_FIELD_ENTER_EVENT } from '../../constants';

import { dataTestIdsGroupRow, GroupRow } from './components/group-row';
import { getMinMax } from './utils';

const dataTestIds = {
  ...dataTestIdsGroupRow,
  label: 'repeat-field-renderer-label',
  add: 'repeat-field-renderer-add',
};

export { dataTestIds as dataTestIdsGroupRenderer };

export interface GroupRenderer {
  classes?: FormGen.OverridableClassName;
}

/**
 * Render a FormGen.FieldGroup.
 *
 * If the FieldGroup is a FormGen.FieldGroupArray, then only one group is rendered and the ability to add/remove groups is disabled.
 * If the FieldGroup is a FormGen.FieldGroupFunction, then render as many groups as there is currently in the formik values and allow to add/remove groups.
 * If FieldGroup declares enableCloning=true, then in addition to the ability to add/remove groups, the ability to clone groups is also added.
 */
export const GroupRenderer: React.FC<
  FormGen.FieldProps<FormGen.FieldGroupArray | FormGen.FieldGroupFunction> & GroupRenderer
> = ({ formikProps, formGenField, ...props }) => {
  const name = formGenField.name;
  const values = get(formikProps.values, name);
  const error = get(formikProps.errors, name);
  const { min, max } = getMinMax(formGenField);
  const enableCloning = formGenField.enableCloning;
  const { getInitialValuesWithDefaults } = useFormGenFields({});
  const formStateContext = useFormStateContext();

  const rowsRefs: HTMLDivElement[] = [];

  function handleAdd() {
    if (isGroupFieldFunction(formGenField)) {
      const newValues = cloneDeep(values);
      const newInitialValues = getInitialValuesWithDefaults(formGenField.fields(values.length), {});
      formikProps.setFieldValue(name, [...newValues, newInitialValues]);

      if (formStateContext) {
        const { setFieldState } = formStateContext;
        setFieldState(`${name}[${values.length}]`, {});
      }
    }
  }

  function handleEnterEvent(event) {
    // find the last row and see if it contains the element where the user pressed enter.
    // since we only want to add new row when user is hitting return on the last row.
    const elementWhereEventWasRaised = event.target;
    if (rowsRefs.length > 0 && rowsRefs[rowsRefs.length - 1].contains(elementWhereEventWasRaised)) {
      handleAdd();
    }
  }

  useEvent(TEXT_FIELD_ENTER_EVENT, handleEnterEvent);

  function handleClone(index: number) {
    if (isGroupFieldFunction(formGenField)) {
      const newValues = cloneDeep(values);
      const clonedValues = newValues[index];
      newValues.splice(index, 0, clonedValues);
      formikProps.setFieldValue(name, newValues);

      if (formStateContext) {
        const { setFieldState } = formStateContext;
        setFieldState(`${name}[${values.length}]`, clonedValues);
      }
    }
  }

  function handleRemove(index: number) {
    if (isGroupFieldFunction(formGenField)) {
      if (values.length === min) {
        return;
      }

      const newValues = cloneDeep(values);
      newValues.splice(index, 1);
      formikProps.setFieldValue(name, newValues);

      // when removing a group we also need to remove any state associated to it.
      if (formStateContext) {
        const { setFieldState } = formStateContext;
        setFieldState(`${name}[${index}]`, undefined);
      }
    }
  }

  const numRepeatedItems = isGroupFieldFunction(formGenField) ? values?.length : 0;

  const isSingleGroupItem = isGroupFieldArray(formGenField) && formGenField.fields.length === 1;

  React.useEffect(() => {
    if (formStateContext) {
      const { updateGroupValues, groupValues } = formStateContext;
      if (values !== groupValues) {
        updateGroupValues(values);
      }
    }
  }, [formStateContext, values]);

  React.useEffect(() => {
    if (formStateContext) {
      const { groupValues, setFieldState } = formStateContext;
      const newValues = cloneDeep(values);
      formikProps.setFieldValue(name, [...newValues, groupValues]);
      groupValues.forEach(val => setFieldState(`${name}[${values.length}]`, val));
    }
  }, [formStateContext, values]);

  return (
    <Box className={isSingleGroupItem ? '' : props.classes?.groupContainer}>
      <Show when={Boolean(formGenField.label)}>
        <Typography data-testid={dataTestIds.label} variant="h6">
          {formGenField.label}
        </Typography>
      </Show>
      {isGroupFieldFunction(formGenField) ? (
        times(numRepeatedItems).map(groupIndex => (
          <GroupRow
            ref={el => rowsRefs.push(el)}
            key={groupIndex}
            groupIndex={groupIndex}
            formikProps={formikProps}
            formGenField={formGenField}
            min={min}
            onClone={enableCloning ? handleClone : undefined}
            onRemove={handleRemove}
            {...props}
          />
        ))
      ) : (
        <GroupRow groupIndex={-1} min={-1} formikProps={formikProps} formGenField={formGenField} {...props} />
      )}
      <Show when={isGroupFieldFunction(formGenField) && numRepeatedItems < max}>
        <IconButton data-testid={dataTestIds.add} icon={Add} size="small" color="primary" onClick={handleAdd} />
      </Show>
      <Show when={Boolean(error)}>
        <FormHelperText error={true}>{typeof error === 'string' && error}</FormHelperText>
      </Show>
    </Box>
  );
};
