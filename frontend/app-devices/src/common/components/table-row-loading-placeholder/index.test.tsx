import { render } from '@testing-library/react';
import React from 'react';

import { mockDevices } from '../../test-helpers/devices';

import { dataTestIdsTableRowLoadingPlaceholder as dataTestIds, TableRowLoadingPlaceholder } from '.';

const Table: React.FC = ({ children }) => (
  <table>
    <tbody>{children}</tbody>
  </table>
);

describe('TableRowLoadingPlaceholder', () => {
  it('renders a loading state', () => {
    const { queryByTestId } = render(<TableRowLoadingPlaceholder isLoading={true} collection={[]} />, {
      wrapper: Table,
    });

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cell)).toHaveProperty('colSpan', 1);
  });

  it('renders an empty state', () => {
    const { container, queryByTestId } = render(<TableRowLoadingPlaceholder isLoading={false} collection={[]} />, {
      wrapper: Table,
    });

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(container).toHaveTextContent('No Devices');
  });

  it('renders a custom empty state', () => {
    const { container, queryByTestId } = render(
      <TableRowLoadingPlaceholder isLoading={false} collection={[]} text="Nothing here" />,
      { wrapper: Table }
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(container).toHaveTextContent('Nothing here');
  });

  it('renders nothing', () => {
    const { container, queryByTestId } = render(
      <TableRowLoadingPlaceholder isLoading={false} collection={mockDevices} />,
      { wrapper: Table }
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(container).toHaveTextContent('');
  });

  it('renders with a specific colspan', () => {
    const { queryByTestId } = render(<TableRowLoadingPlaceholder isLoading={true} collection={[]} colSpan={3} />, {
      wrapper: Table,
    });

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cell)).toHaveProperty('colSpan', 3);
  });
});
