import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDisplayJson as dataTestIds, DisplayJson } from '.';

describe('DisplayJson', () => {
  it('opens a modal with some JSON content', () => {
    const { queryByTestId } = render(<DisplayJson json={{ foobar: 'foobaz' }} title="Some Title" />);

    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).toHaveTextContent('{ "foobar": "foobaz" }');
  });
});
