import { buildRolledUpByTimeObservation, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { getObservationsByTimeRange } from '@plentyag/app-environment/src/common/utils';
import { DEFAULT_TIME_GRANULARITY } from '@plentyag/app-environment/src/common/utils/constants';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDetailsDrawer as dataTestIds, DetailsDrawer } from '.';

const [metric] = mockMetrics;
const observationsByTime = {
  rolledUpAt: '2022-01-01T00:00:00Z',
  observations: [buildRolledUpByTimeObservation({ rolledUpAt: '2022-01-01T00:00:00Z' })],
};
const timeGranularity = DEFAULT_TIME_GRANULARITY;
const onClose = jest.fn();

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-normalized-observations', () => ({
  useFetchNormalizedObservations: () => ({
    data: [],
    isLoading: false,
  }),
}));

function renderDrawerDetails(props?: Partial<DetailsDrawer>) {
  return render(
    <DetailsDrawer
      metric={metric}
      observationsByTime={observationsByTime}
      timeGranularity={timeGranularity}
      valueAttribute={undefined}
      onClose={onClose}
      {...props}
    />
  );
}

describe('DetailsDrawer', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with a title', () => {
    const { queryByTestId } = renderDrawerDetails();

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent(
      getObservationsByTimeRange(observationsByTime, timeGranularity)
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders without a title', () => {
    const { queryByTestId } = renderDrawerDetails({ observationsByTime: undefined });

    expect(queryByTestId(dataTestIds.title)).not.toBeInTheDocument();
  });

  it('calls `onClose` when closing the drawer', () => {
    const { queryByTestId } = renderDrawerDetails();

    queryByTestId(dataTestIds.close).click();

    expect(onClose).toHaveBeenCalled();
  });
});
