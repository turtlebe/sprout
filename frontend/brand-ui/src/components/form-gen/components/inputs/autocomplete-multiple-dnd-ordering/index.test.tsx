import { chooseFromAutocompleteByIndex, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent } from '@testing-library/react';
import * as yup from 'yup';

import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { AutocompleteMultipleDndOrdering, dataTestIds } from '.';

jest.useFakeTimers();

const options = makeOptions({
  formGenField: {
    validate: yup.mixed().required(),
    selected: ['O1', 'O2'],
    options: [
      { value: 'O1ID', label: 'O1' },
      { value: 'O2ID', label: 'O2' },
      { value: 'O3ID', label: 'O3' },
      { value: 'O4ID', label: 'O4' },
    ],
  },
});

describe('AutocompleteMultipleDndOrdering', () => {
  it('uses the correct selected default options and extra available options', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultipleDndOrdering,
      options()
    );

    const draggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(draggableOptions.length).toBe(2);
    expect(draggableOptions[0]).toHaveTextContent('O1');
    expect(draggableOptions[1]).toHaveTextContent('O2');
  });

  it('can add new option using autocomplete', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultipleDndOrdering,
      options()
    );

    const draggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(draggableOptions.length).toBe(2);

    const autoCompleteDataTestId = dataTestIds.autoCompleteDataTestId(formGenField.name);
    const input = getByTestId(autoCompleteDataTestId).querySelector('input');
    await actAndAwait(() => openAutocomplete(input));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1)); // Click on O4

    const newDraggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(newDraggableOptions.length).toBe(3);
    expect(newDraggableOptions[2]).toHaveTextContent('O4');
  });

  it('changes order of components if dragged and dropped', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultipleDndOrdering,
      options()
    );

    const draggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(draggableOptions.length).toBe(2);
    const firstOption = draggableOptions[0];
    const secondOption = draggableOptions[1];
    expect(firstOption).toHaveTextContent('O1');
    expect(secondOption).toHaveTextContent('O2');

    await actAndAwait(() => fireEvent.dragStart(firstOption));
    await actAndAwait(() => fireEvent.dragEnter(secondOption));
    jest.runAllTimers();
    await actAndAwait(() => fireEvent.dragOver(secondOption));
    await actAndAwait(() => fireEvent.drop(secondOption));

    const newDraggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(newDraggableOptions.length).toBe(2);
    expect(newDraggableOptions[0]).toHaveTextContent('O2');
    expect(newDraggableOptions[1]).toHaveTextContent('O1');
  });

  it('uses the passed in label when set', async () => {
    const newOptionLabel = 'Add new option';
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultipleDndOrdering,
      options({
        formGenField: {
          validate: yup.mixed().required(),
          addNewOptionText: newOptionLabel,
          selected: ['O1', 'O2'],
          options: [
            { value: 'O1ID', label: 'O1' },
            { value: 'O2ID', label: 'O2' },
            { value: 'O3ID', label: 'O3' },
            { value: 'O4ID', label: 'O4' },
          ],
        },
      })
    );
    const label = getByTestId(formGenField.name).querySelector('label');
    expect(label).toHaveTextContent(newOptionLabel);
  });

  it('orders correctly based on selected options', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultipleDndOrdering,
      options({
        formGenField: {
          validate: yup.mixed().required(),
          selected: ['O2', 'O3', 'O4', 'O1'],
          options: [
            { value: 'O1ID', label: 'O1' },
            { value: 'O2ID', label: 'O2' },
            { value: 'O3ID', label: 'O3' },
            { value: 'O4ID', label: 'O4' },
          ],
        },
      })
    );
    const draggableOptions = getByTestId(formGenField.name).querySelectorAll('div[draggable]');
    expect(draggableOptions.length).toBe(4);
    expect(draggableOptions[0]).toHaveTextContent('O2');
    expect(draggableOptions[1]).toHaveTextContent('O3');
    expect(draggableOptions[2]).toHaveTextContent('O4');
    expect(draggableOptions[3]).toHaveTextContent('O1');
  });

  it('uses the default label when not set', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultipleDndOrdering,
      options({ formGenField: { validate: yup.mixed().required() } })
    );
    const label = getByTestId(formGenField.name).querySelector('label');
    expect(label).toHaveTextContent(`Add new ${formGenField.name}`);
  });

  it('changes to no more options when all options were used', async () => {
    const [{ getByTestId }, { formGenField }] = await renderFormGenInputAsync(
      AutocompleteMultipleDndOrdering,
      makeOptions({
        formGenField: {
          validate: yup.mixed().required(),
          selected: ['O1', 'O2'],
          options: [
            { value: 'O1ID', label: 'O1' },
            { value: 'O2ID', label: 'O2' },
          ],
        },
      })()
    );
    const label = getByTestId(formGenField.name).querySelector('label');
    expect(label).toHaveTextContent('No more options');
  });
});
