import { ReactComponent } from '@plentyag/brand-ui/src/components/form-gen/components/inputs/react-component';
import {
  makeOptions,
  renderFormGenInputAsync,
} from '@plentyag/brand-ui/src/components/form-gen/components/inputs/test-helpers';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';

import { dataTestIds, FieldDynamicOption, TaskDefinitionFields } from '.';

import { dataTestIdsDraggableFieldCard } from './components/draggable-field-card';

jest.useFakeTimers();

const makeComponentAndOptions = (
  initialFields: FieldDynamicOption[],
  availableTypes: ProdActions.FundamentalFieldTypes[],
  disabled?: boolean
) => {
  const EditFieldsComponent: React.FC<FormGen.FieldProps<FormGen.FieldReactComponent>> = props => {
    return (
      <TaskDefinitionFields
        disabled={disabled}
        initialFields={initialFields}
        availableTypes={availableTypes}
        {...props}
      />
    );
  };

  return makeOptions({ formGenField: { component: EditFieldsComponent } })();
};

describe('TaskDefinitionFields', () => {
  it('renders correctly based on initial options', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      ReactComponent,
      makeComponentAndOptions(
        [
          { fieldName: 'optionalString', fieldType: 'TYPE_STRING', isRequired: false },
          { fieldName: 'mandatoryFloat', fieldType: 'TYPE_FLOAT', isRequired: true },
        ],
        ['TYPE_STRING', 'TYPE_FLOAT']
      )
    );

    const draggableFields = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(draggableFields.length).toBe(2);
    expect(draggableFields[0]).toHaveTextContent('optionalStringTYPE_STRINGOptional');
    expect(draggableFields[1]).toHaveTextContent('mandatoryFloatTYPE_FLOATRequired');

    const renderedChips = getByTestId(formGenField.name).querySelectorAll('span.MuiChip-label');
    // 3 chips for each of the initial fields and 1 chip for the add new button
    expect(renderedChips.length).toBe(6);
    expect(renderedChips[0]).toHaveTextContent('optionalString');
    expect(renderedChips[1]).toHaveTextContent('TYPE_STRING');
    expect(renderedChips[2]).toHaveTextContent('Optional');
    expect(renderedChips[3]).toHaveTextContent('mandatoryFloat');
    expect(renderedChips[4]).toHaveTextContent('TYPE_FLOAT');
    expect(renderedChips[5]).toHaveTextContent('Required');
    // input for new field name rendered
    expect(getByTestId(dataTestIds.inputFieldNameDataTestId(formGenField.name))).toBeInTheDocument();
    expect(getByTestId(dataTestIds.inputFieldTypeDataTestId(formGenField.name))).toBeInTheDocument();
    expect(getByTestId(dataTestIds.isFieldRequiredDataTestId(formGenField.name))).toBeInTheDocument();
    expect(getByTestId(dataTestIds.addNewFieldDataTestId(formGenField.name))).toBeInTheDocument();
    expect(getByTestId(dataTestIds.addNewFieldErrorDataTestId(formGenField.name))).toBeInTheDocument();
    // No error displayed to begin with
    expect(getByTestId(dataTestIds.addNewFieldErrorDataTestId(formGenField.name))).toHaveTextContent('');
    expect(getByTestId(dataTestIds.addNewFieldDataTestId(formGenField.name))).toHaveTextContent('Add new field');
  });

  it('changes order of fields if dragged and dropped', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      ReactComponent,
      makeComponentAndOptions(
        [
          { fieldName: 'optionalString', fieldType: 'TYPE_STRING', isRequired: false },
          { fieldName: 'mandatoryFloat', fieldType: 'TYPE_FLOAT', isRequired: true },
        ],
        ['TYPE_STRING', 'TYPE_FLOAT']
      )
    );

    const draggableFields = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(draggableFields.length).toBe(2);
    const firstField = draggableFields[0];
    const secondField = draggableFields[1];
    expect(firstField).toHaveTextContent('optionalStringTYPE_STRINGOptional');
    expect(secondField).toHaveTextContent('mandatoryFloatTYPE_FLOATRequired');

    await actAndAwait(() => fireEvent.dragStart(firstField));
    await actAndAwait(() => fireEvent.dragEnter(secondField));
    await actAndAwait(() => jest.runAllTimers());
    await actAndAwait(() => fireEvent.dragOver(secondField));
    await actAndAwait(() => fireEvent.drop(secondField));

    const newDraggableFields = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(newDraggableFields.length).toBe(2);
    expect(newDraggableFields[0]).toHaveTextContent('mandatoryFloatTYPE_FLOATRequired');
    expect(newDraggableFields[1]).toHaveTextContent('optionalStringTYPE_STRINGOptional');
  });

  it('can add new field using the form', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      ReactComponent,
      makeComponentAndOptions(
        [
          { fieldName: 'optionalString', fieldType: 'TYPE_STRING', isRequired: false },
          { fieldName: 'mandatoryFloat', fieldType: 'TYPE_FLOAT', isRequired: true },
        ],
        ['TYPE_STRING', 'TYPE_FLOAT']
      )
    );

    const draggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(draggableOptions.length).toBe(2);

    changeTextField(dataTestIds.inputFieldTypeDataTestId(formGenField.name), 'TYPE_STRING');
    changeTextField(dataTestIds.inputFieldNameDataTestId(formGenField.name), 'newField');

    const addNewChip = getByTestId(dataTestIds.addNewFieldDataTestId(formGenField.name));
    fireEvent.click(addNewChip);

    const newDraggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(newDraggableOptions.length).toBe(3);
    expect(newDraggableOptions[2]).toHaveTextContent('newFieldTYPE_STRINGRequired');
  });

  it('deletes field when delete button clicked', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      ReactComponent,
      makeComponentAndOptions(
        [
          { fieldName: 'optionalString', fieldType: 'TYPE_STRING', isRequired: false },
          { fieldName: 'mandatoryFloat', fieldType: 'TYPE_FLOAT', isRequired: true },
        ],
        ['TYPE_STRING', 'TYPE_FLOAT']
      )
    );

    const draggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(draggableOptions.length).toBe(2);

    const deleteButtons = getByTestId(dataTestIds.draggableFieldsContainerId(formGenField.name)).querySelectorAll(
      'button'
    );
    expect(deleteButtons.length).toBe(2);
    fireEvent.click(deleteButtons[0]);

    const newDraggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(newDraggableOptions.length).toBe(1);
    expect(newDraggableOptions[0]).toHaveTextContent('mandatoryFloatTYPE_FLOATRequired');
  });

  it('displays error message if empty or duplicate', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      ReactComponent,
      makeComponentAndOptions(
        [
          { fieldName: 'optionalString', fieldType: 'TYPE_STRING', isRequired: false },
          { fieldName: 'mandatoryFloat', fieldType: 'TYPE_FLOAT', isRequired: true },
        ],
        ['TYPE_STRING', 'TYPE_FLOAT']
      )
    );
    expect(getByTestId(dataTestIds.addNewFieldErrorDataTestId(formGenField.name))).toHaveTextContent('');

    const addNewChip = getByTestId(dataTestIds.addNewFieldDataTestId(formGenField.name));

    fireEvent.click(addNewChip);
    expect(getByTestId(dataTestIds.addNewFieldErrorDataTestId(formGenField.name))).toHaveTextContent(
      'Name was not set!'
    );

    changeTextField(dataTestIds.inputFieldNameDataTestId(formGenField.name), 'optionalString');
    fireEvent.click(addNewChip);
    expect(getByTestId(dataTestIds.addNewFieldErrorDataTestId(formGenField.name))).toHaveTextContent('Duplicate name!');
    // No new fields added since both were error scenarios
    const newDraggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(newDraggableOptions.length).toBe(2);
  });

  it('disables component', async () => {
    const [{ getByTestId, queryAllByTestId }, { formGenField }] = await renderFormGenInputAsync(
      ReactComponent,
      makeComponentAndOptions(
        [
          { fieldName: 'optionalString', fieldType: 'TYPE_STRING', isRequired: false },
          { fieldName: 'mandatoryFloat', fieldType: 'TYPE_FLOAT', isRequired: true },
        ],
        ['TYPE_STRING', 'TYPE_FLOAT'],
        true // disabled
      )
    );

    // should disable 5 fields:

    // all drag and drop elements
    queryAllByTestId(dataTestIdsDraggableFieldCard.delete).forEach(el => expect(el).toBeDisabled());

    // add new field button
    expect(getByTestId(dataTestIds.addNewFieldDataTestId(formGenField.name))).toBeDisabled();

    // "field name" input element
    expect(getByTestId(dataTestIds.inputFieldNameDataTestId(formGenField.name)).querySelector('input')).toBeDisabled();

    // field "type" drop down selector
    expect(getByTestId(dataTestIds.inputFieldTypeDataTestId(formGenField.name))).toHaveClass('Mui-disabled');

    // field "required" checkbox
    expect(getByTestId(dataTestIds.isFieldRequiredDataTestId(formGenField.name)).querySelector('input')).toBeDisabled();
  });
});
