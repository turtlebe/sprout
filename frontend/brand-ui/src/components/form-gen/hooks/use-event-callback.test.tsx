import { render } from '@testing-library/react';
import React from 'react';

import { useEventCallback } from './use-event-callback';

type Callback = () => void;

// This is a contrived example to test "use-event-callback"...
// We have a component "TestReactPassingCalling" which creates a callback
// that simply returns the current "text" value. This callback is passed
// down to "RenderOnceComponent", but since this component is memoized to
// only render once. That is, when the top-level component re-renders it won't
// rerender the subcomponent, so effectively the callback in "RenderOnceComponent"
// stays the same forever. But yet when the callback is invoked it gets the
// latest "value". This is because internally "useEventCallback" has a ref
// to the function passed into "useEventCallback". And we have magic!
//
// In our case we use "useEventCallback" to re-implement Formik's "validateField".
// This enures validateField has latest ref to FormikProps. And specifically for
// a scenario in "inputs/autocomplete/index.tsx" in "handleChange" (see code below).
// This ensures validateField has the latest field value after the setFieldValue.
//
//  const handleChange: AutocompleteProps['onChange'] = async (event, newSelectedOption) => {
//     setSelectedOption(newSelectedOption);
//     await formikProps.setFieldValue(name, newSelectedOption?.value);
//     formikProps.validateField(name);
//  };

const RenderOnceComponent = React.memo<{ callback: Callback }>(
  props => {
    const [textReturnedFromCallback, setTextReturnedFromCallback] = React.useState('');

    function handleClick() {
      const textValue = props.callback();
      // just so we can save value into local component's dom for testing purposes.
      setTextReturnedFromCallback(textValue as unknown as string);
    }

    return (
      <div>
        <button data-testid={'trigger-callback'} onClick={handleClick} />
        <div data-testid={'current-text-value-render-once-component'}>{textReturnedFromCallback}</div>
      </div>
    );
  },
  prevProps => !!prevProps.callback // will cause component to only every render once.
);

const TestReactPassingCalling: React.FC = () => {
  const [text, setText] = React.useState('initial-value-from-top-component');

  // callback never changes, so RenderOnceComponent (which is memoized) will
  // only render once, but still the callback gets the latest value of "text"
  const callback = useEventCallback(() => text);

  // this won't work, since new callback won't get passed down, the sub-component
  // is using old callback and won't get correct value of "text"
  // const callback = React.useCallback(() => text, []);

  return (
    <div>
      <button data-testid={'trigger-new-value'} onClick={() => setText('new-value')} />
      <RenderOnceComponent callback={callback} />
    </div>
  );
};

describe('useEventCallback', () => {
  it('gets updated "text" value in callback', () => {
    const { queryByTestId } = render(<TestReactPassingCalling />);

    const trigger = queryByTestId('trigger-new-value');
    const triggerCallback = queryByTestId('trigger-callback');

    triggerCallback.click();
    expect(queryByTestId('current-text-value-render-once-component')).toHaveTextContent(
      'initial-value-from-top-component'
    );

    // causes 'new-value' to be set at top level.  now callback should get the new value as well
    trigger.click();
    triggerCallback.click();
    expect(queryByTestId('current-text-value-render-once-component')).toHaveTextContent('new-value');
  });
});
