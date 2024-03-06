import React from 'react';

export interface MockAutocompleteFarmDefObject {
  valueOnChange: any;
  dataTestId: string;
}

export const mockAutocompleteFarmDefObject = (buttons: MockAutocompleteFarmDefObject[] = []) => {
  const fakeAutoCompleteFarmDefObject = jest.fn(props => {
    function handleClick(valueOnChange) {
      return function () {
        props.onChange(valueOnChange);
      };
    }

    function handleBlur() {
      props.onBlur();
    }

    return (
      <>
        {buttons.map(button => (
          <button
            key={button.dataTestId}
            data-testid={button.dataTestId}
            onClick={handleClick(button.valueOnChange)}
            onBlur={handleBlur}
          />
        ))}
      </>
    );
  });

  return { AutocompleteFarmDefObject: fakeAutoCompleteFarmDefObject };
};
