import { DropdownDashboardActions } from '@plentyag/app-environment/src/common/components/dropdown-dashboard-actions';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import { mockDashboards } from '../common/test-helpers';
import { PATHS } from '../paths';

import { DashboardPage, dataTestIdsDashboardPage as dataTestIds } from '.';

import { dataTestIdsNoWidgets, GridWidgets } from './components';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/app-environment/src/common/components/dropdown-dashboard-actions');
jest.mock('./components/grid-widgets');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const MockGridWidgets = GridWidgets as jest.Mock;
const MockDropdownDashboardActions = DropdownDashboardActions as jest.Mock;

const [dashboard] = mockDashboards;

function renderDashboardPage() {
  const history = createMemoryHistory({ initialEntries: [PATHS.dashboardPage('id')] });

  return render(
    <Router history={history}>
      <Route path={PATHS.dashboardPage(':dashboardId')} component={DashboardPage} />
    </Router>
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    mockCurrentUser();
    mockUseFetchMeasurementTypes();
    mockUseSwrAxios.mockRestore();
    MockGridWidgets.mockRestore();
    MockGridWidgets.mockImplementation(() => <div />);
    MockDropdownDashboardActions.mockRestore();
    MockDropdownDashboardActions.mockImplementation(() => <div />);
  });

  it('renders a loader', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });

    const { queryByTestId } = renderDashboardPage();

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsNoWidgets.info)).not.toBeInTheDocument();
  });

  it('renders the DashboardPage', () => {
    mockUseSwrAxios.mockReturnValue({ data: dashboard, isValidating: false });

    const { queryByTestId } = renderDashboardPage();

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsNoWidgets.info)).toBeInTheDocument();
  });
});
