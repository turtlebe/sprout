import { useFetchAndConvertMetric, useFetchAndConvertObservations } from '@plentyag/app-environment/src/common/hooks';
import { actAndAwaitRender } from '@plentyag/core/src/test-helpers';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { mockMetrics, mockRolledUpByTimeObservations } from '../common/test-helpers';
import { PATHS } from '../paths';

import { dataTestIdsMetricSourcesPage as dataTestIds, MetricSourcesPage } from '.';

jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-metric');
jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-and-convert-observations');
jest.mock('@plentyag/app-environment/src/common/components/button-favorite-metric', () => ({
  ButtonFavoriteMetric: () => <div />,
}));

async function renderMetricSourcesPage() {
  const history = createMemoryHistory({ initialEntries: [PATHS.metricSourcesPage('id')] });

  return actAndAwaitRender(
    <Router history={history}>
      <Route path={PATHS.metricSourcesPage(':metricId')} component={MetricSourcesPage} />
    </Router>
  );
}

const mockUseFetchAndConvertMetric = useFetchAndConvertMetric as jest.Mock;
const mockUseFetchAndConvertObservations = useFetchAndConvertObservations as jest.Mock;

const [metric] = mockMetrics;
const observations = [
  ...mockRolledUpByTimeObservations.map(observation => ({ ...observation, tagPath: 'path/to/ignition' })),
];

describe('MetricSourcesPage', () => {
  beforeEach(() => {
    mockUseFetchAndConvertMetric.mockRestore();
    mockUseFetchAndConvertObservations.mockRestore();
  });

  it('renders a loader', async () => {
    mockUseFetchAndConvertMetric.mockReturnValue({ data: undefined, isValidating: true });
    mockUseFetchAndConvertObservations.mockReturnValue({ data: undefined, isLoading: true });

    const { queryByTestId } = await renderMetricSourcesPage();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noSources)).not.toBeInTheDocument();
  });

  it('renders an empty state', async () => {
    mockUseFetchAndConvertMetric.mockReturnValue({ data: metric, isValidating: false });
    mockUseFetchAndConvertObservations.mockReturnValue({ data: [], isLoading: false });

    const { queryByTestId } = await renderMetricSourcesPage();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noSources)).toBeInTheDocument();
  });

  it('renders a list of sources', async () => {
    mockUseFetchAndConvertMetric.mockReturnValue({ data: metric, isValidating: false });
    mockUseFetchAndConvertObservations.mockReturnValue({ data: observations, isLoading: false });

    const { queryByTestId } = await renderMetricSourcesPage();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noSources)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.source(observations[0]))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.source(observations[1]))).not.toBeInTheDocument(); // same source as index 0
  });
});
