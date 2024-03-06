import { mockObservationStats } from '@plentyag/app-environment/src/common/test-helpers';
import { render } from '@testing-library/react';

import { dataTestIdsObservationStatistics as dataTestIds, ObservationStatistics } from '.';

const unitSymbol = 'C';
const stats = mockObservationStats;

describe('ObservationStatistics', () => {
  function renderObservationStatistics({
    isLoading = false,
    observationStats = stats,
  }: Partial<ObservationStatistics>) {
    return render(
      <ObservationStatistics observationStats={observationStats} unitSymbol={unitSymbol} isLoading={isLoading} />
    );
  }

  it('renders -- when loading', () => {
    const { queryByTestId } = renderObservationStatistics({ isLoading: true });

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.max)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.min)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.mean)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.median)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.range)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.stddev)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.count)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
  });

  it('renders -- when the observation stats is null', () => {
    const { queryByTestId } = renderObservationStatistics({ observationStats: null });

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.max)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.min)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.mean)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.median)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.range)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.stddev)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.count)).toHaveTextContent('--');
    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
  });

  it('renders the ObservationStats', () => {
    const { queryByTestId } = renderObservationStatistics({});

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.max)).toHaveTextContent(`${stats.max.toFixed(2)} ${unitSymbol}`);
    expect(queryByTestId(dataTestIds.min)).toHaveTextContent(`${stats.min.toFixed(2)} ${unitSymbol}`);
    expect(queryByTestId(dataTestIds.mean)).toHaveTextContent(`${stats.mean.toFixed(2)} ${unitSymbol}`);
    expect(queryByTestId(dataTestIds.median)).toHaveTextContent(`${stats.median.toFixed(2)} ${unitSymbol}`);
    expect(queryByTestId(dataTestIds.range)).toHaveTextContent(`${(stats.max - stats.min).toFixed(2)} ${unitSymbol}`);
    expect(queryByTestId(dataTestIds.stddev)).toHaveTextContent(`${stats.stddev.toFixed(2)} ${unitSymbol}`);
    expect(queryByTestId(dataTestIds.count)).toHaveTextContent(stats.count.toString());
    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
  });
});
