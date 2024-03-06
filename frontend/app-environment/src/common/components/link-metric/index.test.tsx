import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { titleCase } from 'voca';

import { dataTestIdsLinkMetric as dataTestIds, LinkMetric } from '.';

const [metric] = mockMetrics;
const observationsColor = '#dedede';

describe('LinkMetric', () => {
  it('returns a link to a Metric', () => {
    const { queryByTestId } = render(
      <MemoryRouter>
        <LinkMetric metric={metric} color={observationsColor} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(titleCase(metric.measurementType));
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(metric.observationName);
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(getShortenedPath(metric.path));
  });
});
