import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Metric, Schedule } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { buildScheduleDefinition } from '../common/test-helpers';
import { PATHS } from '../paths';

import { MetricPage } from '.';

interface GetMockUseSwrAxiosImplementation {
  metric: Metric;
  schedule?: Schedule;
}

export const getMockUseSwrAxiosImplementation = ({ metric, schedule }: GetMockUseSwrAxiosImplementation) => {
  return args => {
    if (!args || !args.url) {
      return { data: undefined, isValidating: false, error: undefined, revalidate: jest.fn() };
    }

    if (args.url.includes('get-metric-by-id')) {
      return { data: metric, isValidating: false, error: undefined, revalidate: jest.fn() };
    }

    if (args.url.includes('related-schedule')) {
      return { data: schedule, isValidating: false, error: undefined, revalidate: jest.fn() };
    }

    if (schedule && args.url.includes(schedule.path)) {
      return {
        data: buildScheduleDefinition({
          path: schedule.path,
          actionDefinition: { from: 0, to: 100, graphable: true, measurementType: 'TEMPERATURE' },
        }),
        isValidating: false,
        error: undefined,
        revalidate: jest.fn(),
      };
    }

    return { data: undefined, isValidating: false, error: undefined, revalidate: jest.fn() };
  };
};

export function renderMetricPage() {
  const history = createMemoryHistory({ initialEntries: [PATHS.metricPage('metric-id')] });
  const location = {
    search: '',
    hash: '',
    pathname: PATHS.metricPage('metric-id'),
    state: undefined,
  };

  const match = {
    isExact: true,
    params: { metricId: 'metric-id' },
    path: PATHS.metricPage('metric-id'),
    url: PATHS.metricPage('metric-id'),
  };

  const rendered = render(
    <Router history={history}>
      <GlobalSnackbar>
        <MetricPage history={history} location={location} match={match} />
      </GlobalSnackbar>
    </Router>
  );

  return {
    ...rendered,
    history,
  };
}
