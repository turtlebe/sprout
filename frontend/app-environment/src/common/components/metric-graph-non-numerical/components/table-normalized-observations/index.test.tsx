import { mockNormalizedObservation as observations } from '@plentyag/app-environment/src/common/test-helpers';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import moment from 'moment';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsTableNormalizedObservations as dataTestIds, TableNormalizedObservations } from '.';

const [observation] = observations;

function renderTableNormalizedObservations({ isLoading = false, ...props }: TableNormalizedObservations) {
  return render(
    <MemoryRouter>
      <TableNormalizedObservations isLoading={isLoading} {...props} />
    </MemoryRouter>
  );
}

describe('TableNormalizedObservations', () => {
  it('renders a loader', () => {
    const { queryByTestId } = renderTableNormalizedObservations({ observations: [], isLoading: true });

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders a table with observations', () => {
    const { queryByTestId } = renderTableNormalizedObservations({ observations, isLoading: false });

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRow(observation))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.cellObservedAt(observation))).toHaveTextContent(
      moment(moment.utc(observation.observedAt).toDate()).format('LLL')
    );
    expect(queryByTestId(dataTestIds.cellPath(observation))).toHaveTextContent(getShortenedPath(observation.path));
    expect(queryByTestId(dataTestIds.cellValue(observation))).toHaveTextContent(observation.valueString);
    expect(queryByTestId(dataTestIds.cellOtherProperties(observation))).toBeEmptyDOMElement();
    expect(queryByTestId(dataTestIds.valueHeader)).toHaveTextContent('Value');
  });

  it('renders a table with observations with a custom value', () => {
    const valueAttribute = 'expBoardSerial';
    const data = observations.map((o, index) => ({
      ...o,
      valueString: JSON.stringify({ expBoardSerial: `SERIAL-${index}` }),
    }));
    const { queryByTestId } = renderTableNormalizedObservations({
      observations: data,
      valueAttribute,
      isLoading: false,
    });

    expect(queryByTestId(dataTestIds.cellValue(observation))).toHaveTextContent('SERIAL-0');
    expect(queryByTestId(dataTestIds.valueHeader)).toHaveTextContent(valueAttribute);
  });
});
