import { buildMetric, buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDownloadData as dataTestIds, DownloadData } from '.';

const startDateTime = new Date('2023-01-01T00:00:00Z');
const endDateTime = new Date('2023-01-03T00:00:00Z');
const metrics = [buildMetric({}), buildMetric({})];
const observations = [
  [buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-01T00:00:00Z' })],
  [buildRolledUpByTimeObservation({ rolledUpAt: '2023-01-02T00:00:00Z' })],
];

describe('DownloadData', () => {
  it('allows to download a CSV or JSON file', () => {
    const { queryByTestId } = render(
      <DownloadData
        metrics={metrics}
        observations={observations}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        disabled={false}
      />
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.csv)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.json)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.csv)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.json)).not.toBeInTheDocument();
  });

  it('disables the dropdown', () => {
    const { queryByTestId } = render(
      <DownloadData
        metrics={metrics}
        observations={observations}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        disabled
      />
    );

    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
  });
});
