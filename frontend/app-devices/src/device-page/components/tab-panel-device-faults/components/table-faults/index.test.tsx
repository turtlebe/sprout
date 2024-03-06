import { render } from '@testing-library/react';
import React from 'react';

import { mockObservations } from '../../test-mocks';

import { dataTestIdsTableFaults as dataTestIds, TableFaults } from '.';

const [observation1, observation2] = mockObservations;

describe('TableFaults', () => {
  it('renders a table with Faults information', () => {
    const { queryByTestId } = render(<TableFaults observations={mockObservations} />);

    expect(queryByTestId(dataTestIds.tableRow(observation1))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableCellObservationName(observation1))).toHaveTextContent(
      observation1.observationName
    );
    expect(queryByTestId(dataTestIds.hasFarmOsOverride(observation1))).not.toBeInTheDocument();

    expect(queryByTestId(dataTestIds.tableRow(observation2))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableCellObservationName(observation2))).toHaveTextContent(
      observation2.observationName
    );
    expect(queryByTestId(dataTestIds.hasFarmOsOverride(observation2))).toBeInTheDocument();
  });
});
