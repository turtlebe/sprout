import { mockFormikProps } from '@plentyag/brand-ui/src/components/form-gen/components/inputs/test-helpers';
import { FormStateContext } from '@plentyag/brand-ui/src/components/form-gen/hooks/use-form-state-context';
import { getInputByName, keyDownInTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { get, set } from 'lodash';
import React from 'react';

import { dataTestIdsGroupRenderer as dataTestIds, GroupRenderer } from '.';

import { getDropdownActionsDataTestIds } from './components/group-row/components/dropdown-actions/';

describe('GroupRenderer', () => {
  it('renders with a label', () => {
    const formGenField: FormGen.FieldGroupArray = { type: 'group', name: 'group', label: 'Label', fields: [] };
    const formikProps = mockFormikProps({ formGenField });

    const { queryByTestId } = render(<GroupRenderer formGenField={formGenField} formikProps={formikProps} />);

    expect(queryByTestId(dataTestIds.label)).toHaveTextContent('Label');
  });

  it('renders without a label', () => {
    const formGenField: FormGen.FieldGroupArray = { type: 'group', name: 'group', fields: [] };
    const formikProps = mockFormikProps({ formGenField });

    const { queryByTestId } = render(<GroupRenderer formGenField={formGenField} formikProps={formikProps} />);

    expect(queryByTestId(dataTestIds.label)).not.toBeInTheDocument();
  });

  describe('FormGen.FieldGroupArray', () => {
    const formGenField: FormGen.FieldGroupArray = {
      type: 'group',
      name: 'group',
      label: 'Label',
      fields: [{ type: 'TextField', name: 'textfield', label: 'textfield' }],
    };

    it('renders a FieldGroupArray', () => {
      const formikProps = mockFormikProps({ formGenField, value: { textfield: undefined } });

      const { queryByTestId } = render(<GroupRenderer formGenField={formGenField} formikProps={formikProps} />);

      expect(queryByTestId(dataTestIds.add)).not.toBeInTheDocument();
      expect(getInputByName('group.textfield')).toHaveValue('');
    });

    it('renders a FieldGroupArray with initial value', () => {
      const formikProps = mockFormikProps({ formGenField, value: { textfield: '1' } });

      const { queryByTestId } = render(<GroupRenderer formGenField={formGenField} formikProps={formikProps} />);

      expect(queryByTestId(dataTestIds.add)).not.toBeInTheDocument();
      expect(getInputByName('group.textfield')).toHaveValue('1');
    });
  });

  describe('FormGen.FieldGroupFunction', () => {
    const textField: FormGen.FieldTextField = {
      type: 'TextField',
      name: 'textfield',
      label: 'textfield',
      addGroupOnNewLineOrReturn: true,
    };

    const formGenField: FormGen.FieldGroupFunction = {
      type: 'group',
      name: 'group',
      label: 'Label',
      fields: () => [textField],
    };

    it('renders a FieldGroupFunction', () => {
      const formikProps = mockFormikProps({ formGenField, value: [{ textfield: undefined }] });

      const { queryByTestId } = render(<GroupRenderer formGenField={formGenField} formikProps={formikProps} />);

      expect(queryByTestId(dataTestIds.add)).toBeInTheDocument();
      expect(getInputByName('group[0].textfield')).toHaveValue('');
    });

    it('renders a FieldGroupFunction with initial values', () => {
      const formikProps = mockFormikProps({ formGenField, value: [{ textfield: '1' }] });

      const { queryByTestId } = render(<GroupRenderer formGenField={formGenField} formikProps={formikProps} />);

      expect(queryByTestId(dataTestIds.add)).toBeInTheDocument();
      expect(getInputByName('group[0].textfield')).toHaveValue('1');
    });

    it('adds and removes groups', () => {
      const formikProps = mockFormikProps({ formGenField, value: [{ textfield: '1' }] });

      const { queryByTestId, rerender } = render(
        <GroupRenderer formGenField={formGenField} formikProps={formikProps} />
      );

      expect(getInputByName('group[0].textfield')).toHaveValue('1');
      expect(getInputByName('group[1].textfield')).not.toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).remove)).not.toBeInTheDocument();

      // -> Add a new Group
      queryByTestId(dataTestIds.add).click();

      const valuesAfterAdd = [{ textfield: '1' }, { textfield: undefined }];
      // note: index 2 because the textfield called setFieldValue too.
      expect(formikProps.setFieldValue).toHaveBeenNthCalledWith(2, 'group', valuesAfterAdd);

      // -> Re-render with new formikProps
      const formikPropsAfterAdd = mockFormikProps({ formGenField, value: valuesAfterAdd });
      rerender(<GroupRenderer formGenField={formGenField} formikProps={formikPropsAfterAdd} />);

      expect(getInputByName('group[1].textfield')).toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown)).not.toBeInTheDocument();

      // -> Remove first Group
      queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).remove).click();

      const valuesAfterRemove = [{ textfield: undefined }];
      expect(formikPropsAfterAdd.setFieldValue).toHaveBeenNthCalledWith(2, 'group', valuesAfterRemove);

      // -> Re-render with new formikProps
      const formikPropsAfterRemove = mockFormikProps({ formGenField, value: valuesAfterRemove });
      rerender(<GroupRenderer formGenField={formGenField} formikProps={formikPropsAfterRemove} />);

      expect(getInputByName('group[0].textfield')).toHaveValue('');
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).remove)).not.toBeInTheDocument();
    });

    it('adds and removes groups with a FieldState', () => {
      function buildFieldState(initialValues) {
        const formState = initialValues;
        const getFieldState = name => get(formState, name);
        const setFieldState = jest
          .fn()
          .mockImplementation((name, newFieldState) => set(formState, name, newFieldState));

        return { getFieldState, setFieldState };
      }

      const formStateContext = buildFieldState({ 'group[0]': { textfield: '1' } });
      const formikProps = mockFormikProps({ formGenField, value: [{ textfield: '1' }] });

      const { queryByTestId, rerender } = render(
        <FormStateContext.Provider value={formStateContext}>
          <GroupRenderer formGenField={formGenField} formikProps={formikProps} />
        </FormStateContext.Provider>
      );

      expect(getInputByName('group[0].textfield')).toHaveValue('1');
      expect(getInputByName('group[1].textfield')).not.toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).remove)).not.toBeInTheDocument();

      expect(formStateContext.setFieldState).not.toHaveBeenCalled();

      // -> Add a new Group
      queryByTestId(dataTestIds.add).click();
      expect(formStateContext.setFieldState).toHaveBeenCalledTimes(1);
      expect(formStateContext.setFieldState).toHaveBeenNthCalledWith(1, 'group[1]', {});

      const valuesAfterAdd = [{ textfield: '1' }, { textfield: undefined }];
      // note: index 2 because the textfield called setFieldValue too.
      expect(formikProps.setFieldValue).toHaveBeenNthCalledWith(2, 'group', valuesAfterAdd);

      // -> Re-render with new formikProps
      const formikPropsAfterAdd = mockFormikProps({ formGenField, value: valuesAfterAdd });

      // -> Set error on 2nd group
      formStateContext.setFieldState('group[1]', { error: 'error2' });

      rerender(
        <FormStateContext.Provider value={formStateContext}>
          <GroupRenderer formGenField={formGenField} formikProps={formikPropsAfterAdd} />
        </FormStateContext.Provider>
      );

      expect(getInputByName('group[1].textfield')).toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown)).not.toBeInTheDocument();

      expect(formStateContext.setFieldState).toHaveBeenCalledTimes(2);
      expect(formStateContext.setFieldState).toHaveBeenNthCalledWith(2, 'group[1]', { error: 'error2' });

      // -> Remove first Group
      queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).remove).click();

      // -> Removes the first FieldState.
      expect(formStateContext.setFieldState).toHaveBeenCalledTimes(3);
      expect(formStateContext.setFieldState).toHaveBeenNthCalledWith(3, 'group[0]', undefined);
    });

    it('adds and clones groups', () => {
      const formikProps = mockFormikProps({
        formGenField: { ...formGenField, enableCloning: true },
        value: [{ textfield: '1' }],
      });

      const { queryByTestId, rerender } = render(
        <GroupRenderer formGenField={formGenField} formikProps={formikProps} />
      );

      expect(getInputByName('group[0].textfield')).toHaveValue('1');
      expect(getInputByName('group[1].textfield')).not.toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).remove)).not.toBeInTheDocument();

      // -> Add a new Group
      queryByTestId(dataTestIds.add).click();

      const valuesAfterAdd = [{ textfield: '1' }, { textfield: undefined }];
      // note: index 2 because the textfield called setFieldValue too.
      expect(formikProps.setFieldValue).toHaveBeenNthCalledWith(2, 'group', valuesAfterAdd);

      // -> Re-render with new formikProps
      const formikPropsAfterAdd = mockFormikProps({
        formGenField: { ...formGenField, enableCloning: true },
        value: valuesAfterAdd,
      });
      rerender(
        <GroupRenderer formGenField={{ ...formGenField, enableCloning: true }} formikProps={formikPropsAfterAdd} />
      );

      expect(getInputByName('group[1].textfield')).toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown)).toBeInTheDocument();

      // -> Clone first Group
      queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown).click();
      queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdownClone).click();

      const valuesAfterClone = [{ textfield: '1' }, { textfield: '1' }, { textfield: undefined }];
      expect(formikPropsAfterAdd.setFieldValue).toHaveBeenNthCalledWith(2, 'group', valuesAfterClone);

      // -> Re-render with new formikProps
      const formikPropsAfterClone = mockFormikProps({
        formGenField: { ...formGenField, enableCloning: true },
        value: valuesAfterClone,
      });
      rerender(
        <GroupRenderer formGenField={{ ...formGenField, enableCloning: true }} formikProps={formikPropsAfterClone} />
      );

      expect(getInputByName('group[0].textfield')).toHaveValue('1');
      expect(getInputByName('group[1].textfield')).toHaveValue('1');
      expect(getInputByName('group[2].textfield')).toHaveValue('');
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown)).toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(1)).dropdown)).toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(2)).dropdown)).toBeInTheDocument();
    });

    it('adds and clones groups with a FieldState', () => {
      function buildFieldState(initialValues) {
        const formState = initialValues;
        const getFieldState = name => get(formState, name);
        const setFieldState = jest
          .fn()
          .mockImplementation((name, newFieldState) => set(formState, name, newFieldState));

        return { getFieldState, setFieldState };
      }

      const formStateContext = buildFieldState({ 'group[0]': { textfield: '1' } });
      const formikProps = mockFormikProps({
        formGenField: { ...formGenField, enableCloning: true },
        value: [{ textfield: '1' }],
      });

      const { queryByTestId, rerender } = render(
        <FormStateContext.Provider value={formStateContext}>
          <GroupRenderer formGenField={{ ...formGenField, enableCloning: true }} formikProps={formikProps} />
        </FormStateContext.Provider>
      );

      expect(getInputByName('group[0].textfield')).toHaveValue('1');
      expect(getInputByName('group[1].textfield')).not.toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).remove)).not.toBeInTheDocument();

      expect(formStateContext.setFieldState).not.toHaveBeenCalled();

      // -> Add a new Group
      queryByTestId(dataTestIds.add).click();
      expect(formStateContext.setFieldState).toHaveBeenCalledTimes(1);
      expect(formStateContext.setFieldState).toHaveBeenNthCalledWith(1, 'group[1]', {});

      const valuesAfterAdd = [{ textfield: '1' }, { textfield: undefined }];
      // note: index 2 because the textfield called setFieldValue too.
      expect(formikProps.setFieldValue).toHaveBeenNthCalledWith(2, 'group', valuesAfterAdd);

      // -> Re-render with new formikProps
      const formikPropsAfterAdd = mockFormikProps({
        formGenField: { ...formGenField, enableCloning: true },
        value: valuesAfterAdd,
      });

      // -> Set error on 2nd group
      formStateContext.setFieldState('group[1]', { error: 'error2' });

      rerender(
        <FormStateContext.Provider value={formStateContext}>
          <GroupRenderer formGenField={{ ...formGenField, enableCloning: true }} formikProps={formikPropsAfterAdd} />
        </FormStateContext.Provider>
      );

      expect(getInputByName('group[1].textfield')).toBeInTheDocument();
      expect(queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(0)).dropdown)).toBeInTheDocument();

      expect(formStateContext.setFieldState).toHaveBeenCalledTimes(2);
      expect(formStateContext.setFieldState).toHaveBeenNthCalledWith(2, 'group[1]', { error: 'error2' });

      // -> Clone second group with error
      queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(1)).dropdown).click();
      queryByTestId(getDropdownActionsDataTestIds(dataTestIds.actions(1)).dropdownClone).click();

      // -> Clears the FieldState for cloned group
      expect(formStateContext.setFieldState).toHaveBeenCalledTimes(3);
      expect(formStateContext.setFieldState).toHaveBeenNthCalledWith(3, 'group[2]', { textfield: undefined });
    });

    async function renderRepeatFieldWithSimulatedEnterKeyEvent(groupIndex: number) {
      const formikProps = mockFormikProps({ formGenField, value: [{ textfield: '1' }, { textfield: '2' }] });

      render(<GroupRenderer formGenField={formGenField} formikProps={formikProps} />);

      // expect the two calls when textfield is created
      expect(formikProps.setFieldValue).toHaveBeenCalledTimes(2);
      expect(formikProps.setFieldValue).toHaveBeenNthCalledWith(1, 'group[0].textfield', '1');
      expect(formikProps.setFieldValue).toHaveBeenNthCalledWith(2, 'group[1].textfield', '2');

      expect(getInputByName('group[0].textfield')).toBeInTheDocument();
      expect(getInputByName('group[1].textfield')).toBeInTheDocument();

      // simulate hitting enter key to cause creating a new field.
      const textInput = getInputByName(`group[${groupIndex}].textfield`);
      await actAndAwait(() => keyDownInTextField(textInput, 13));

      return { formikProps };
    }

    it('adds new group when textfield raising "enter" event is in the last group', async () => {
      // simulate hitting enter key on group index 1 field.
      const { formikProps } = await renderRepeatFieldWithSimulatedEnterKeyEvent(1);

      // setFieldValue got called again, because field was added.
      expect(formikProps.setFieldValue).toHaveBeenCalledTimes(3);

      const valuesAfterAdd = [{ textfield: '1' }, { textfield: '2' }, { textfield: undefined }];
      expect(formikProps.setFieldValue).toHaveBeenNthCalledWith(3, 'group', valuesAfterAdd);
    });

    it('does not add new group when textfield raising "enter" event is not in the last group', async () => {
      // simulate hitting enter key on group index 0 field, this won't add because
      // we trying to hit return in first field (index 0), only works on last field in group.
      const { formikProps } = await renderRepeatFieldWithSimulatedEnterKeyEvent(0);

      // nothing else gets added.
      expect(formikProps.setFieldValue).toHaveBeenCalledTimes(2);
    });

    it('shows add button when number of rows is less than max allowed', () => {
      const formikProps = mockFormikProps({
        formGenField: { ...formGenField, max: 2, min: 1 },
        value: [{ textfield: '1' }],
      });

      const { queryByTestId } = render(<GroupRenderer formGenField={formGenField} formikProps={formikProps} />);

      expect(queryByTestId(dataTestIds.add)).toBeInTheDocument();
    });

    it('hides add button when number of rows is equal to max allowed', () => {
      const _formGenField = { ...formGenField, max: 2, min: 1 };
      const formikProps = mockFormikProps({
        formGenField: _formGenField,
        value: [{ textfield: '1' }, { textfield: '2' }],
      });

      const { queryByTestId } = render(<GroupRenderer formGenField={_formGenField} formikProps={formikProps} />);

      expect(queryByTestId(dataTestIds.add)).not.toBeInTheDocument();
    });
  });
});
