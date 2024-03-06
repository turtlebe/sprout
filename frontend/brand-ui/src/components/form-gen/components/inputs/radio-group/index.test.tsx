import { actAndAwait } from '@plentyag/core/src/test-helpers';

import { makeOptions, renderFormGenInput } from '../test-helpers';

import { dataTestIds, NO_OPTIONS_MESSAGE, RadioGroup } from '.';

function expectInputToBeChecked(element: HTMLElement) {
  expect(element.querySelector('input')).toBeChecked();
}

function expectInputNotToBeChecked(element: HTMLElement) {
  expect(element.querySelector('input')).not.toBeChecked();
}

describe('RadioGroup', () => {
  it('displays sorted radio controls with sorted categories', () => {
    // unsorted radio buttons and unsorted categoies.
    const radioGroupOptions = [
      { value: 'radio2', label: 'xyz' },
      { category: 'cat2', value: 'radioc2-2', label: 'Radio 456' },
      { category: 'cat1', value: 'radioc1-2', label: 'Radio C1 2' },
      { category: 'cat2', value: 'radioc2-1', label: 'Radio 123' },
      { value: 'radio1', label: 'abc' },
      { category: 'cat1', value: 'radioc1-1', label: 'Radio C1 1' },
    ];
    const options = makeOptions({
      formGenField: {
        options: radioGroupOptions,
      },
    });

    const [{ getByTestId, getAllByTestId }] = renderFormGenInput(RadioGroup, options());

    const radioGroup = getByTestId(dataTestIds.radioGroup);
    expect(radioGroup.children).toHaveLength(radioGroupOptions.length);

    const categories = getAllByTestId(dataTestIds.category);
    expect(categories).toHaveLength(2);
    expect(categories[0]).toHaveTextContent('cat1');
    expect(categories[1]).toHaveTextContent('cat2');

    // sorted order should be:
    // (no category)
    // abc
    // xyz
    //
    // cat 1 (category)
    // Radio C1 1
    // Radio C1 2
    //
    // cat 2 (category)
    // Radio 123
    // Radio 456

    // first item has no category
    expect(radioGroup.children[0]).toHaveTextContent('abc');
    expect(radioGroup.children[1]).toHaveTextContent('xyz');

    // 2nd item has category cat1
    expect(radioGroup.children[2]).toHaveTextContent('cat1Radio C1 1');
    expect(radioGroup.children[3]).toHaveTextContent('Radio C1 2');

    // 4th item has category cat2
    expect(radioGroup.children[4]).toHaveTextContent('cat2Radio 123');
    expect(radioGroup.children[5]).toHaveTextContent('Radio 456');
  });

  it('does not sort by label when flag "sortOptionsByLabel" is false', () => {
    // should maintain this sort order.
    const optionsList = [
      { value: 'radio2', label: 'Two' },
      { value: 'radio1', label: 'One' },
      { value: 'radio3', label: 'Three' },
    ];
    const options = makeOptions({
      formGenField: {
        options: optionsList,
        sortOptionsByLabel: false,
      },
    });
    const [{ getByTestId }] = renderFormGenInput(RadioGroup, options());

    const radioGroup = getByTestId(dataTestIds.radioGroup);
    expect(radioGroup.children).toHaveLength(optionsList.length);
    for (let i = 0; i < optionsList.length; i++) {
      expect(radioGroup.children[i]).toHaveTextContent(optionsList[i].label);
    }
  });

  it('display helperText when provided', () => {
    const radioGroupOptions = [{ value: 'radio1', label: 'Radio 1', helperText: 'help me' }];
    const options = makeOptions({
      formGenField: {
        options: radioGroupOptions,
      },
    });

    const [{ getByTestId }] = renderFormGenInput(RadioGroup, options());

    const helperText = getByTestId(dataTestIds.helperText);
    expect(helperText).toHaveTextContent('help me');
  });

  it('disables radio button', () => {
    const radioGroupOptions = [{ value: 'radio1', label: 'Radio 1', helperText: 'help me' }];
    const options = makeOptions({
      formGenField: {
        options: radioGroupOptions,
        radioProps: { disabled: true },
      },
    });

    const [{ getByTestId }] = renderFormGenInput(RadioGroup, options());

    const radioButton = getByTestId(dataTestIds.radioButton);
    expect(radioButton).toHaveClass('Mui-disabled');
  });

  it('is initialzed to default value and updates to new value on click', async () => {
    const radioGroupOptions = [
      { value: 'radio1', label: 'Radio 1' },
      { value: 'radio2', label: 'Radio 2' },
    ];
    const options = makeOptions({
      initialValues: { mockName: 'radio2' },
      formGenField: {
        options: radioGroupOptions,
      },
    });

    const [{ getAllByTestId }] = renderFormGenInput(RadioGroup, options());

    const radioButtons = getAllByTestId(dataTestIds.radioButton);

    expectInputNotToBeChecked(radioButtons[0]);
    expectInputToBeChecked(radioButtons[1]);

    await actAndAwait(() => radioButtons[0].click());

    expectInputToBeChecked(radioButtons[0]);
    expectInputNotToBeChecked(radioButtons[1]);
  });

  it('validates on change', async () => {
    const radioGroupOptions = [
      { value: 'radio1', label: 'Radio 1' },
      { value: 'radio2', label: 'Radio 2' },
    ];
    const options = makeOptions({
      formGenField: {
        options: radioGroupOptions,
      },
    });

    const [{ getAllByTestId }, { validateField }] = renderFormGenInput(RadioGroup, options());

    const radioButtons = getAllByTestId(dataTestIds.radioButton);
    expect(radioButtons).toHaveLength(2);

    expectInputNotToBeChecked(radioButtons[0]);
    expectInputNotToBeChecked(radioButtons[1]);

    await actAndAwait(() => radioButtons[1].click());

    expect(validateField).toHaveBeenCalledWith('radio2');
    expectInputNotToBeChecked(radioButtons[0]);
    expectInputToBeChecked(radioButtons[1]);
  });

  it('displays message when no options are provided', () => {
    const options = makeOptions({
      formGenField: {
        options: [],
      },
    });
    const [{ getByTestId }] = renderFormGenInput(RadioGroup, options());

    expect(getByTestId(dataTestIds.noOptions)).toHaveTextContent(NO_OPTIONS_MESSAGE);
  });
});
