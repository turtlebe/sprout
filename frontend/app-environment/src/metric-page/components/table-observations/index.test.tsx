import { buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';

import { dataTestIdsTableObservations as dataTestIds, TableObservations } from '.';

const observations = [
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:00:00Z', value: 'A', valueCount: 10 }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:00:00Z', value: 'B', valueCount: 5 }),
  buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T01:05:00Z', value: 'C', valueCount: 15 }),
];
observations.sort((a, b) => new Date(b.rolledUpAt).getTime() - new Date(a.rolledUpAt).getTime());

function renderTableObservations({ isLoading = false, ...props }: TableObservations) {
  return render(<TableObservations isLoading={isLoading} {...props} />);
}

describe('TableObservations', () => {
  it('renders a loader', () => {
    const { queryByTestId } = renderTableObservations({ observations: [], isLoading: true });

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders a table with observations', () => {
    const { queryByTestId } = renderTableObservations({ observations, isLoading: false });

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    observations.forEach((observation, index) => {
      expect(queryByTestId(dataTestIds.tableRow(index))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellObservedAt(index))).toHaveTextContent(
        moment(moment.utc(observation.rolledUpAt).toDate()).format('LLL')
      );

      expect(queryByTestId(dataTestIds.cellValue(index))).toHaveTextContent(observation.value);
      expect(queryByTestId(dataTestIds.cellCount(index))).toHaveTextContent(observation.valueCount.toString());
    });
    expect(queryByTestId(dataTestIds.valueHeader)).toHaveTextContent('Value');
  });

  it('renders a table with observations with a custom value', () => {
    const valueAttribute = 'expBoardSerial';

    const { queryByTestId } = renderTableObservations({
      observations,
      valueAttribute,
      isLoading: false,
    });

    expect(queryByTestId(dataTestIds.valueHeader)).toHaveTextContent(valueAttribute);
  });
});
