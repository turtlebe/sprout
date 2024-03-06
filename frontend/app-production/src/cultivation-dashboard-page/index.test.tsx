import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { CultivationDashboardPage, dataTestIdsCultivationDashboardPage as dataTestIds } from '.';

describe('CentralProcessingDashboardPage', () => {
  function renderCentralProcessingDashboardPage() {
    return render(<CultivationDashboardPage />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('renders the page', () => {
    mockCurrentUser();
    const { queryByTestId } = renderCentralProcessingDashboardPage();

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });

  it('renders message when site/farm is not supported', () => {
    mockCurrentUser({ currentFarmDefPath: 'sites/SSF2/farms/Tigris' });

    const { queryByTestId } = renderCentralProcessingDashboardPage();

    expect(queryByTestId(dataTestIds.notSupportedFarm)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.content)).not.toBeInTheDocument();
  });

  it('renders dashboard when farm is supported', () => {
    mockCurrentUser();

    const { queryByTestId } = renderCentralProcessingDashboardPage();

    expect(queryByTestId(dataTestIds.notSupportedFarm)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.content)).toBeInTheDocument();
  });
});
