import { buildRolledUpByTimeObservation } from '@plentyag/app-environment/src/common/test-helpers';
import { dataInterpolations } from '@plentyag/app-environment/src/common/utils/constants';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsGraphLegendNonNumerical as dataTestIds, GraphLegendNonNumerical } from '.';

describe('GraphLegendNonNumerical', () => {
  it('renders nothing', () => {
    const { queryByTestId } = render(<GraphLegendNonNumerical observations={[]} />);

    expect(queryByTestId(dataTestIds.notExpanded)).toBeEmptyDOMElement();
  });

  it('renders a legend for the observations values', () => {
    const { queryByTestId } = render(
      <GraphLegendNonNumerical
        observations={[
          buildRolledUpByTimeObservation({ value: 'a', valueCount: 10, rolledUpAt: '2022-01-01T00:00:00Z' }),
          buildRolledUpByTimeObservation({ value: 'b', valueCount: 10, rolledUpAt: '2022-01-01T00:15:00Z' }),
          buildRolledUpByTimeObservation({ value: 'a', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
        ]}
      />
    );

    expect(queryByTestId(dataTestIds.item('a'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.item('b'))).toBeInTheDocument();
    // Collapsible button should not be present, since observations < DEFAULT_DISPLAY_LIMIT
    expect(queryByTestId(dataTestIds.button)).not.toBeInTheDocument();
    // NotExpanded block should be present, since observations < DEFAULT_DISPLAY_LIMIT
    expect(queryByTestId(dataTestIds.notExpanded)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.expanded)).not.toBeInTheDocument();
  });

  it('renders a legend for step data interpolation', () => {
    const { queryByTestId } = render(
      <GraphLegendNonNumerical
        observations={[
          buildRolledUpByTimeObservation({ value: 'a', valueCount: 10, rolledUpAt: '2022-01-01T00:00:00Z' }),
          buildRolledUpByTimeObservation({ value: 'b', valueCount: 10, rolledUpAt: '2022-01-01T00:15:00Z' }),
          buildRolledUpByTimeObservation({ value: 'a', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
        ]}
        dataInterpolation={dataInterpolations[1]}
      />
    );

    expect(queryByTestId(dataTestIds.item('data'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.notExpanded)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.expanded)).not.toBeInTheDocument();
  });

  it('renders legends for observation values up to DEFAULT_DISPLAY_LIMIT', () => {
    const { queryByTestId } = render(
      <GraphLegendNonNumerical
        observations={[
          buildRolledUpByTimeObservation({ value: 'a', valueCount: 10, rolledUpAt: '2022-01-01T00:00:00Z' }),
          buildRolledUpByTimeObservation({ value: 'b', valueCount: 10, rolledUpAt: '2022-01-01T00:15:00Z' }),
          buildRolledUpByTimeObservation({ value: 'a', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
          buildRolledUpByTimeObservation({ value: 'c', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
          buildRolledUpByTimeObservation({ value: 'd', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
          buildRolledUpByTimeObservation({ value: 'e', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
        ]}
      />
    );

    expect(queryByTestId(dataTestIds.item('a'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.item('b'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.item('c'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.item('d'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.item('e'))).toBeInTheDocument();
    // Collapsible button should not be present, since observations = DEFAULT_DISPLAY_LIMIT
    expect(queryByTestId(dataTestIds.button)).not.toBeInTheDocument();
    // NotExpanded block should be present, since observations = DEFAULT_DISPLAY_LIMIT
    expect(queryByTestId(dataTestIds.notExpanded)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.expanded)).not.toBeInTheDocument();
  });

  it('renders legends for observations values beyond DEFAULT_DISPLAY_LIMIT', () => {
    const { queryByTestId } = render(
      <GraphLegendNonNumerical
        observations={[
          buildRolledUpByTimeObservation({ value: 'a', valueCount: 10, rolledUpAt: '2022-01-01T00:00:00Z' }),
          buildRolledUpByTimeObservation({ value: 'b', valueCount: 10, rolledUpAt: '2022-01-01T00:15:00Z' }),
          buildRolledUpByTimeObservation({ value: 'a', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
          buildRolledUpByTimeObservation({ value: 'c', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
          buildRolledUpByTimeObservation({ value: 'd', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
          buildRolledUpByTimeObservation({ value: 'e', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
          buildRolledUpByTimeObservation({ value: 'f', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
          buildRolledUpByTimeObservation({ value: 'g', valueCount: 10, rolledUpAt: '2022-01-01T00:30:00Z' }),
        ]}
      />
    );

    // Collapsible button should be present, since observations > DEFAULT_DISPLAY_LIMIT
    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    // Expanded block should be present, since observations > DEFAULT_DISPLAY_LIMIT
    expect(queryByTestId(dataTestIds.expanded)).toBeInTheDocument();

    // 'f' and 'g' should not be visible given DEFAULT_DISPLAY_LIMIT
    expect(queryByTestId(dataTestIds.item('f'))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.item('g'))).not.toBeInTheDocument();

    // Click on collapsible button
    queryByTestId(dataTestIds.button).click();

    // 'f' and 'g' should be visible with click on button
    expect(queryByTestId(dataTestIds.item('a'))).toBeVisible();
    expect(queryByTestId(dataTestIds.item('b'))).toBeVisible();
    expect(queryByTestId(dataTestIds.item('c'))).toBeVisible();
    expect(queryByTestId(dataTestIds.item('d'))).toBeVisible();
    expect(queryByTestId(dataTestIds.item('e'))).toBeVisible();
    expect(queryByTestId(dataTestIds.item('f'))).toBeVisible();
    expect(queryByTestId(dataTestIds.item('g'))).toBeVisible();
  });
});
