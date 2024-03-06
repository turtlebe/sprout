import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';

import { mockFormikProps } from '../test-helpers';

import { memoGroupWithFormikProps, memoWithFormikProps } from '.';

interface Counter extends FormGen.FieldProps<FormGen.FieldTextField> {}

const Counter: React.FC<Counter> = ({ formGenField, formikProps, context }) => {
  const { hasRendered, onClick } = context;
  const [counter, setCounter] = React.useState(1);

  hasRendered();

  const handleClick = () => {
    setCounter(counter + 1);
    onClick(formikProps, formGenField, counter);
  };

  return (
    <button data-testid={formGenField.name} onClick={handleClick}>
      {counter}
    </button>
  );
};

const CounterMemo = memoWithFormikProps<FormGen.FieldTextField>(Counter);

const formGenField1: FormGen.FieldTextField = {
  type: 'TextField',
  name: 'mockName1',
  label: 'Mock Label 1',
};
const formGenField2: FormGen.FieldTextField = {
  type: 'TextField',
  name: 'mockName2',
  label: 'Mock Label 2',
};

const hasRenderedFormGenField1 = jest.fn();
const hasRenderedFormGenField2 = jest.fn();

describe('memoWithFormikProps', () => {
  beforeEach(() => {
    hasRenderedFormGenField1.mockRestore();
    hasRenderedFormGenField2.mockRestore();
  });

  it('re-renders all the time without memoWithFormikProps', async () => {
    const handleClick = jest.fn().mockImplementation((formikProps, formGenField, counter) => {
      formikProps.setFieldValue(formGenField.name, counter, false);
    });
    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <>
            <Counter
              formGenField={formGenField1}
              formikProps={formikProps}
              context={{
                onClick: handleClick,
                hasRendered: hasRenderedFormGenField1,
              }}
            />
            <Counter
              formGenField={formGenField2}
              formikProps={formikProps}
              context={{
                onClick: handleClick,
                hasRendered: hasRenderedFormGenField2,
              }}
            />
          </>
        )}
      </Formik>
    );

    expect(getByTestId(formGenField1.name)).toHaveTextContent('1');
    expect(getByTestId(formGenField2.name)).toHaveTextContent('1');
    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(1);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(1);

    await actAndAwait(() => getByTestId(formGenField1.name).click());

    expect(handleClick).toHaveBeenCalledTimes(1);

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(2);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(2);
  });

  it('re-renders if the value changes', async () => {
    const handleClick = (formikProps, formGenField, counter) => formikProps.setFieldValue(formGenField.name, counter);
    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <>
            <CounterMemo
              formGenField={formGenField1}
              formikProps={formikProps}
              context={{
                onClick: handleClick,
                hasRendered: hasRenderedFormGenField1,
              }}
            />
            <CounterMemo
              formGenField={formGenField2}
              formikProps={formikProps}
              context={{
                onClick: handleClick,
                hasRendered: hasRenderedFormGenField2,
              }}
            />
          </>
        )}
      </Formik>
    );

    expect(getByTestId(formGenField1.name)).toHaveTextContent('1');
    expect(getByTestId(formGenField2.name)).toHaveTextContent('1');

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(1);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(1);

    await actAndAwait(() => getByTestId(formGenField1.name).click());

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(2);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(1);

    await actAndAwait(() => getByTestId(formGenField2.name).click());

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(2);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(2);
  });

  it('re-renders if the error changes', async () => {
    const handleClick = (formikProps, formGenField) => formikProps.setFieldError(formGenField.name, 'error');
    const { getByTestId } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <>
            <CounterMemo
              formGenField={formGenField1}
              formikProps={formikProps}
              context={{
                onClick: handleClick,
                hasRendered: hasRenderedFormGenField1,
              }}
            />
            <CounterMemo
              formGenField={formGenField2}
              formikProps={formikProps}
              context={{
                onClick: handleClick,
                hasRendered: hasRenderedFormGenField2,
              }}
            />
          </>
        )}
      </Formik>
    );

    expect(getByTestId(formGenField1.name)).toHaveTextContent('1');
    expect(getByTestId(formGenField2.name)).toHaveTextContent('1');

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(1);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(1);

    await actAndAwait(() => getByTestId(formGenField1.name).click());

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(2);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(1);

    await actAndAwait(() => getByTestId(formGenField2.name).click());

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(2);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(2);
  });

  it('re-renders if the formGenField changes', () => {
    const formGenField3: FormGen.FieldTextField = {
      type: 'TextField',
      name: 'mockName3',
      label: 'Mock Label 3',
    };

    const { rerender } = render(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <>
            <CounterMemo
              formGenField={formGenField1}
              formikProps={formikProps}
              context={{
                onClick: () => {},
                hasRendered: hasRenderedFormGenField1,
              }}
            />
            <CounterMemo
              formGenField={formGenField2}
              formikProps={formikProps}
              context={{
                onClick: () => {},
                hasRendered: hasRenderedFormGenField2,
              }}
            />
          </>
        )}
      </Formik>
    );

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(1);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(1);

    rerender(
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        {formikProps => (
          <>
            <CounterMemo
              formGenField={formGenField1}
              formikProps={formikProps}
              context={{
                onClick: () => {},
                hasRendered: hasRenderedFormGenField1,
              }}
            />
            <CounterMemo
              formGenField={formGenField3}
              formikProps={formikProps}
              context={{
                onClick: () => {},
                hasRendered: hasRenderedFormGenField2,
              }}
            />
          </>
        )}
      </Formik>
    );

    expect(hasRenderedFormGenField1).toHaveBeenCalledTimes(1);
    expect(hasRenderedFormGenField2).toHaveBeenCalledTimes(2);
  });
});

describe('memoGroupWithFormikProps', () => {
  const group1: FormGen.FieldGroupArray = {
    type: 'group',
    name: 'group',
    fields: [{ type: 'TextField', name: 'textfield' }],
  };
  const group2: FormGen.FieldGroupFunction = {
    type: 'group',
    name: 'group',
    fields: () => [{ type: 'TextField', name: 'textfield' }],
  };
  const Component = jest.fn();
  const MemoComponent = memoGroupWithFormikProps(Component);

  beforeEach(() => {
    Component.mockRestore();
    Component.mockImplementation(() => null);
  });

  it('re-renders when the formGenField changes', () => {
    const formikProps = mockFormikProps({ formGenField: group1 });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group1} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> formGenField changes
    rerender(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });

  it('re-renders when the initialValues changes', () => {
    const formikProps = mockFormikProps({ formGenField: group1 });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group1} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> initialValues changes
    const formikProps2 = { ...formikProps, initialValues: { group: { textfield: 1 } } };
    rerender(<MemoComponent groupIndex={0} formGenField={group1} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });

  it('re-renders when the groupIndex changes', () => {
    const formikProps = mockFormikProps({ formGenField: group2 });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> groupIndex changes
    rerender(<MemoComponent groupIndex={1} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });

  it('re-renders when the values changes for a non-repeatable group ', () => {
    const formikProps = mockFormikProps({ formGenField: group1 });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group1} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> value changes
    const formikProps2 = { ...formikProps, values: { group: { textfield: 2 } } };
    rerender(<MemoComponent groupIndex={0} formGenField={group1} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });

  it('re-renders when the errors changes for a non-repeatable group', () => {
    const formikProps = mockFormikProps({ formGenField: group1 });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group1} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> error changes
    const formikProps2 = { ...formikProps, errors: { group: { textfield: 'error' } } };
    rerender(<MemoComponent groupIndex={0} formGenField={group1} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });

  it('re-renders when the values for the current group changes', () => {
    const formikProps = mockFormikProps({ formGenField: group2 });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> value changes
    const formikProps2 = { ...formikProps, values: { group: [{ textfield: '1' }] } };
    rerender(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });

  it('re-renders when the errors for the current group changes', () => {
    const formikProps = mockFormikProps({ formGenField: group2 });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> error changes
    const formikProps2 = { ...formikProps, errors: { group: [{ textfield: 'error' }] } };
    rerender(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });

  it('does not re-render when the values for another group changes', () => {
    const formikProps = mockFormikProps({
      formGenField: group2,
      value: [{ textfield: undefined }, { textfield: undefined }],
    });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> values for group at index 0 changes
    const formikProps2 = { ...formikProps, values: { group: [{ textfield: undefined }, { textfield: '1' }] } };
    rerender(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(1);
  });

  it('does not re-render when the errors for another group changes', () => {
    const formikProps = mockFormikProps({ formGenField: group2 });

    const { rerender } = render(<MemoComponent groupIndex={1} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> errors for group at index 0 changes
    const formikProps2 = { ...formikProps, errors: { group: [{ textfield: 'error' }] } };
    rerender(<MemoComponent groupIndex={1} formGenField={group2} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(1);
  });

  it('re-renders when adding a new row ', () => {
    const formikProps = mockFormikProps({ formGenField: group2, value: [{ textfield: undefined }] });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> 2nd row is added
    const formikProps2 = { ...formikProps, values: { group: [{ textfield: undefined }, { textfield: undefined }] } };
    rerender(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });

  it('re-renders when removing an existing row', () => {
    const formikProps = mockFormikProps({
      formGenField: group2,
      value: [{ textfield: undefined }, { textfield: undefined }],
    });

    const { rerender } = render(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps} />);

    expect(Component).toHaveBeenCalledTimes(1);

    // -> 2nd row is removed
    const formikProps2 = { ...formikProps, values: { group: [{ textfield: undefined }] } };
    rerender(<MemoComponent groupIndex={0} formGenField={group2} formikProps={formikProps2} />);

    expect(Component).toHaveBeenCalledTimes(2);
  });
});
