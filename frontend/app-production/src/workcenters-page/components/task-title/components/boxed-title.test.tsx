import { render } from '@testing-library/react';
import React from 'react';

import { BoxedTitle, dataTestIdsBoxedTitle as dataTestIds } from './boxed-title';

describe('BoxedTitle', () => {
  it('renders a title', () => {
    const mockTitle = 'mock title';
    const { queryByTestId } = render(<BoxedTitle title={mockTitle} />);

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(mockTitle);
  });
});
