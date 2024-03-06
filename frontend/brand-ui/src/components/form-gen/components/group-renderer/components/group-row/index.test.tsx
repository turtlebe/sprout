import { FormStateContext } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-state-context';
import { render } from '@testing-library/react';
import { get, set } from 'lodash';
import React from 'react';

import { mockFormikProps } from '../../../inputs/test-helpers';

import { dataTestIdsGroupRow as dataTestIds, GroupRow } from '.';

import { getDropdownActionsDataTestIds } from './components/dropdown-actions/';

const groupIndex = 0;
const onClone = jest.fn();
const onRemove = jest.fn();
const formGenField: FormGen.FieldGroupArray = {
  type: 'group',
  name: 'group',
  fields: [{ type: 'TextField', name: 'textfield' }],
};
const formGenFieldGroupFunction: FormGen.FieldGroupFunction = {
  type: 'group',
  name: 'group',
  fields: () => [{ type: 'TextField', name: 'textfield' }],
};
const formikProps = mockFormikProps({ formGenField, value: { textfield: '1' } });
const formikPropsRepeatFunction = mockFormikProps({ formGenField, value: [{ textfield: '1' }] });

function buildFieldState(initialValues) {
  const formState = { group: initialValues };
  const getFieldState = name => get(formState, name);
  const setFieldState = (name, newFieldState) => set(formState, name, newFieldState);

  return { getFieldState, setFieldState };
}

describe('GroupRow', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without additional informations', () => {
    const { queryByTestId } = render(
      <GroupRow groupIndex={groupIndex} min={-1} formGenField={formGenField} formikProps={formikProps} />
    );

    expect(queryByTestId(dataTestIds.error(formGenField.name, groupIndex))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loader(formGenField.name, groupIndex))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.persisted(formGenField.name, groupIndex))).not.toBeInTheDocument();
  });

  it('renders with an error for a FieldGroupArray', () => {
    const { queryByTestId } = render(
      <FormStateContext.Provider value={buildFieldState({ error: 'error' })}>
        <GroupRow groupIndex={groupIndex} min={-1} formGenField={formGenField} formikProps={formikProps} />
      </FormStateContext.Provider>
    );

    expect(queryByTestId(dataTestIds.error(formGenField.name, groupIndex))).toHaveTextContent('error');
  });

  it('renders with an error for a FieldGroupFunction', () => {
    const { queryByTestId } = render(
      <FormStateContext.Provider value={buildFieldState([{ error: 'error' }])}>
        <GroupRow
          groupIndex={groupIndex}
          min={-1}
          formGenField={formGenFieldGroupFunction}
          formikProps={formikPropsRepeatFunction}
        />
      </FormStateContext.Provider>
    );

    expect(queryByTestId(dataTestIds.error(formGenField.name, groupIndex))).toHaveTextContent('error');
  });

  it('renders with a loader and disables the sub fields', () => {
    const { queryByTestId } = render(
      <FormStateContext.Provider value={buildFieldState({ isLoading: true })}>
        <GroupRow groupIndex={groupIndex} min={-1} formGenField={formGenField} formikProps={formikProps} />
      </FormStateContext.Provider>
    );

    expect(queryByTestId(dataTestIds.loader(formGenField.name, groupIndex))).toBeInTheDocument();
  });

  it('renders with a persisted state and disables the sub fields', () => {
    const { queryByTestId } = render(
      <FormStateContext.Provider value={buildFieldState({ isPersisted: true })}>
        <GroupRow groupIndex={groupIndex} min={-1} formGenField={formGenField} formikProps={formikProps} />
      </FormStateContext.Provider>
    );

    expect(queryByTestId(dataTestIds.persisted(formGenField.name, groupIndex))).toBeInTheDocument();
  });

  it('renders with clone and remove actions', () => {
    const formikProps = mockFormikProps({
      formGenField,
      value: [{ textfield: '1' }, { textfield: '2' }],
    });
    const { queryByTestId } = render(
      <GroupRow
        groupIndex={groupIndex}
        formGenField={formGenFieldGroupFunction}
        formikProps={formikProps}
        onClone={onClone}
        onRemove={onRemove}
        min={1}
      />
    );

    expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown)).toBeInTheDocument();
    expect(onClone).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();

    queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown).click();

    expect(onClone).not.toHaveBeenCalledWith(groupIndex);
    expect(onRemove).not.toHaveBeenCalledWith(groupIndex);
  });

  it('does not render with a clone and remove actions', () => {
    const { queryByTestId } = render(
      <GroupRow
        groupIndex={groupIndex}
        min={1}
        formGenField={formGenFieldGroupFunction}
        formikProps={formikPropsRepeatFunction}
      />
    );

    expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown)).not.toBeInTheDocument();
    expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).remove)).not.toBeInTheDocument();
  });

  it('it only renders clone action when "values" length is less than or equal to "min"', () => {
    const formikProps = mockFormikProps({
      formGenField,
      value: [{ textfield: '1' }, { textfield: '2' }],
    });
    const { queryByTestId } = render(
      <GroupRow
        groupIndex={groupIndex}
        min={2}
        onClone={onClone}
        onRemove={onRemove}
        formGenField={formGenFieldGroupFunction}
        formikProps={formikProps}
      />
    );

    expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown)).toBeInTheDocument();
    expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdownClone)).not.toBeInTheDocument();
    expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdownRemove)).not.toBeInTheDocument();
  });
});
