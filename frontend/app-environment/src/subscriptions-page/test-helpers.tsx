import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { AlertRule, Metric, Subscription, TabType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { PATHS } from '../paths';

import { SubscriptionsPage } from '.';

interface GetMockUseSwrAxiosImplementation {
  alertRules?: AlertRule[];
  subscriptions?: Subscription[];
}

export const getMockUseSwrAxiosImplementation = ({
  alertRules = [],
  subscriptions = [],
}: GetMockUseSwrAxiosImplementation) => {
  const metric: Metric = { ...mockMetrics[0], alertRules };
  const subscriptionsResponse = buildPaginatedResponse<Subscription>(subscriptions);

  return args => {
    if (!args || !args.url) {
      return { data: undefined, isValidating: false, error: undefined, revalidate: jest.fn() };
    }

    if (args.url.includes('get-metric-by-id')) {
      return { data: metric, isValidating: false, error: undefined, revalidate: jest.fn() };
    }

    if (args.url.includes('list-subscriptions')) {
      return {
        data: subscriptionsResponse,
        isValidating: false,
        error: undefined,
        revalidate: jest.fn(),
      };
    }

    return { data: undefined, isValidating: false, error: undefined, revalidate: jest.fn() };
  };
};

export interface RenderSubscriptionsPage {
  tabType?: string;
  tabId: string;
}

export function renderSubscriptionsPage({ tabType = TabType.alertRule, tabId }: RenderSubscriptionsPage) {
  const url = PATHS.subscriptionsPageTab('metric-id', tabType, tabId);
  const path = PATHS.subscriptionsPageTab(':metricId', ':tabType(alert-rule|schedule)', ':tabId');

  const history = createMemoryHistory({
    initialEntries: [url],
  });
  const location = {
    search: '',
    hash: '',
    pathname: url,
    state: undefined,
  };

  const match = {
    isExact: true,
    params: { metricId: 'metric-id', tabType, tabId },
    path,
    url,
  };

  const rendered = render(
    <Router history={history}>
      <GlobalSnackbar>
        <SubscriptionsPage history={history} location={location} match={match} />
      </GlobalSnackbar>
    </Router>
  );

  return {
    ...rendered,
    history,
  };
}
