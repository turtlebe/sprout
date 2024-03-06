import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { CentralProcessingDashboardPage, dataTestIdsCentralProcessingDashboardPage as dataTestIds } from '.';

import { BufferOverviewCard, CentralProcessingLinksCard, PreTransferConveyanceCard } from './components';

jest.mock('./components/central-processing-links-card');
const mockCentralProcessingLinksCardDataTestId = 'central-processing-links-card';
const mockCentralProcessingLinksCard = CentralProcessingLinksCard as jest.Mock;
mockCentralProcessingLinksCard.mockReturnValue(<div data-testid={mockCentralProcessingLinksCardDataTestId} />);

jest.mock('./components/pre-transfer-conveyance-card');
const mockPreTransferConveyanceCardDataTestId = 'pre-transfer-conveyance-card';
const mockPreTransferConveyanceCard = PreTransferConveyanceCard as jest.Mock;
mockPreTransferConveyanceCard.mockReturnValue(<div data-testid={mockPreTransferConveyanceCardDataTestId} />);

jest.mock('./components/buffer-overview-card');
const mockBufferCard = BufferOverviewCard as jest.Mock;
mockBufferCard.mockImplementation(({ 'data-testid': dataTestId }) => <div data-testid={dataTestId} />);

describe('CentralProcessingDashboardPage', () => {
  function renderCentralProcessingDashboardPage() {
    return render(<CentralProcessingDashboardPage />, {
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
    expect(queryByTestId(mockCentralProcessingLinksCardDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(mockPreTransferConveyanceCardDataTestId)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.seedlingBufferCard)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.auxBuffer1Card)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.auxBuffer2Card)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.preInspectionCard)).not.toBeInTheDocument();
  });

  it('renders dashboard when farm is supported', () => {
    mockCurrentUser();

    const { queryByTestId } = renderCentralProcessingDashboardPage();

    expect(queryByTestId(mockCentralProcessingLinksCardDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockPreTransferConveyanceCardDataTestId)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.seedlingBufferCard)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.auxBuffer1Card)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.auxBuffer2Card)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.preInspectionCard)).toBeInTheDocument();
  });
});
