import { DoneAll } from '@material-ui/icons';
import { GroupRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/group-renderer';
import { InputRenderer } from '@plentyag/brand-ui/src/components/form-gen/components/input-renderer';
import { getInputComponent } from '@plentyag/brand-ui/src/components/form-gen/components/inputs';
import { useFormGenFields } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-gen-fields';
import { useFormStateContext } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-state-context';
import { isGroupField, isGroupFieldArray } from '@plentyag/brand-ui/src/components/form-gen/utils';
import { Show } from '@plentyag/brand-ui/src/components/show';
import { Box, CircularProgress, FormHelperText } from '@plentyag/brand-ui/src/material-ui/core';
import clsx from 'clsx';
import { get } from 'lodash';
import React from 'react';

import { memoGroupWithFormikProps } from '../../../inputs/memo-with-formik-props';

import { DropdownActions } from './components/dropdown-actions';
import { useStyles } from './styles';

/**
 * Component: Group
 */

export interface Group {
  groupIndex: number;
  classes?: FormGen.OverridableClassName;
}

/**
 * Sub-component to render a given Group. This component simply calls `getConcerteFieldsInGroup` to evaluate all the
 * concrete field within a group and calls <InputRenderer/> for each field or <GroupRenderer/> for nested groups.
 */
export const Group = memoGroupWithFormikProps<FormGen.FieldGroupArray | FormGen.FieldGroupFunction, Group>(
  ({ groupIndex, formGenField, formikProps, ...props }) => {
    const { getConcreteFieldsInGroup } = useFormGenFields({});
    const fieldsInGroup = getConcreteFieldsInGroup(formGenField, formikProps.values, groupIndex);

    return (
      <Box className={props.classes?.groupInputs}>
        {fieldsInGroup.map(fieldInGroup =>
          isGroupField(fieldInGroup) ? (
            <GroupRenderer
              key={fieldInGroup.name}
              formikProps={formikProps}
              formGenField={fieldInGroup}
              classes={{ ...props.classes, groupContainer: props.classes?.nestedGroupContainer }}
              context={props.context}
            />
          ) : (
            <InputRenderer
              InputComponent={getInputComponent(fieldInGroup)}
              key={fieldInGroup.name}
              formGenField={fieldInGroup}
              formikProps={formikProps}
              className={props.classes?.input}
              inputContainer={props.classes?.inputContainerInGroup}
              inputContainerStyle={fieldInGroup.inputContainerStyle}
              style={fieldInGroup.style}
              context={props.context}
              disabled={props.disabled}
            />
          )
        )}
      </Box>
    );
  }
);

/**
 * Component: GroupRow
 */

const dataTestIds = {
  persisted: (name: string, groupIndex: number) => `group-row-persisted-${name}[${groupIndex}]`,
  loader: (name: string, groupIndex: number) => `group-row-loader-${name}[${groupIndex}]`,
  error: (name: string, groupIndex: number) => `group-row-error-${name}[${groupIndex}]`,
  actions: (groupIndex: number) => `group-row-actions-[${groupIndex}]`,
};

export { dataTestIds as dataTestIdsGroupRow };

export interface GroupRow {
  groupIndex: number;
  min: number;
  onClone?: (groupIndex: number) => void;
  onRemove?: (groupIndex: number) => void;
  classes?: FormGen.OverridableClassName;
}

type GroupRowProps = FormGen.FieldProps<FormGen.FieldGroupArray | FormGen.FieldGroupFunction> & GroupRow;

/**
 * Render a Group with various information and CTA such as:
 * - A Remove CTA to remove the group when the group is reapeatable.
 * - An error on the group when present in formState.
 * - An loading state on the group when present in formState.
 * - A persisted state on the group when present in formState.
 */
export const GroupRow = React.forwardRef<HTMLDivElement, GroupRowProps>(
  ({ groupIndex, min, onClone, onRemove, formikProps, formGenField, ...props }, ref) => {
    const classes = useStyles({});
    const formStateContext = useFormStateContext();
    const { getFieldState = () => {} } = formStateContext || {};
    const name = formGenField.name;
    const values = get(formikProps.values, name);

    function groupState(groupIndex) {
      if (isGroupFieldArray(formGenField)) {
        return getFieldState(name) || {};
      }

      return getFieldState(`${name}[${groupIndex}]`) || {};
    }

    function hasError(groupIndex): any {
      return groupState(groupIndex).error;
    }

    function getIsLoading(groupIndex): boolean {
      return groupState(groupIndex).isLoading || false;
    }

    function getIsPersisted(groupIndex): boolean {
      return groupState(groupIndex).isPersisted || false;
    }

    const isLoading = getIsLoading(groupIndex);
    const isPersisted = getIsPersisted(groupIndex);
    const isLoadingOrPersisted = isLoading || isPersisted;
    const error = hasError(groupIndex);

    return (
      <div
        ref={ref}
        className={clsx(
          props.classes?.groupRow,
          Boolean(error) ? classes.groupRowError : isPersisted ? classes.groupRowSuccess : undefined
        )}
        key={groupIndex}
        style={{ position: 'relative' }}
      >
        <Box className={props.classes?.groupItem}>
          <DropdownActions
            onClone={onClone ? () => onClone(groupIndex) : undefined}
            onRemove={() => onRemove(groupIndex)}
            minRowCountForRemove={min}
            disabled={isLoadingOrPersisted}
            totalRowCount={values ? values.length : 0}
            data-testid={dataTestIds.actions(groupIndex)}
          />
          <Group
            groupIndex={groupIndex}
            formGenField={formGenField}
            formikProps={formikProps}
            disabled={isLoadingOrPersisted}
            {...props}
          />
        </Box>
        <Show when={Boolean(error)}>
          <FormHelperText error data-testid={dataTestIds.error(name, groupIndex)}>
            {error}
          </FormHelperText>
        </Show>
        <Show when={isLoading}>
          <CircularProgress size="12px" data-testid={dataTestIds.loader(name, groupIndex)} />
        </Show>
        <Show when={isPersisted}>
          <Box color="success">
            <DoneAll color="inherit" data-testid={dataTestIds.persisted(name, groupIndex)} />
          </Box>
        </Show>
      </div>
    );
  }
);
