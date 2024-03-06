import { render } from '@testing-library/react';
import React from 'react';

import { CountWidget, dataTestIdsCountWidget as dataTestIds } from '.';

describe('CountWidget', () => {
  it('renders', () => {
    // ACT
    const { queryByTestId } = render(<CountWidget name="total count" value={999} data-testid="test" />);

    // ASSERT
    expect(queryByTestId('test')).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.name).textContent).toEqual('total count');
    expect(queryByTestId(dataTestIds.value).textContent).toEqual('999');
  });
});
