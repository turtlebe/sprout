import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTruncated as dataTestIds, Truncated } from '.';

describe('Truncated', () => {
  it('renders nothing', () => {
    const { container } = render(<Truncated text={null} length={5} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders truncated content in a tooltip', () => {
    const { queryByTestId } = render(<Truncated text="colombia" length={5} />);

    expect(queryByTestId(dataTestIds.tooltip)).toBeInTheDocument();

    expect(queryByTestId(dataTestIds.tooltip)).toHaveTextContent('co...');
  });

  it('renders the content without a tooltip', () => {
    const { container, queryByTestId } = render(<Truncated text="italy" length={5} />);

    expect(queryByTestId(dataTestIds.tooltip)).not.toBeInTheDocument();
    expect(container).toHaveTextContent('italy');
  });
});
