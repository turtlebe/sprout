import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDrawerWithClose as dataTestIds, DrawerWithClose } from '.';

describe('DrawerWithClose', () => {
  it('renders title when open is true', () => {
    const { queryByTestId } = render(<DrawerWithClose open onClose={jest.fn()} title={<>test</>} />);

    expect(queryByTestId(dataTestIds.container)).toHaveTextContent('test');
  });

  it('does not render when open is false', () => {
    const { queryByTestId } = render(<DrawerWithClose open={false} onClose={jest.fn()} title={<>test</>} />);
    expect(queryByTestId(dataTestIds.container)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    const { queryByTestId } = render(<DrawerWithClose open onClose={mockOnClose} title={<>test</>} />);

    queryByTestId(dataTestIds.close).click();

    expect(mockOnClose).toHaveBeenCalled();
  });
});
