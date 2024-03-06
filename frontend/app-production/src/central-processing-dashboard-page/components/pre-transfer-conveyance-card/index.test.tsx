import {
  mockCarriers,
  mockTowers,
  mockTransplanerOutfeedTowers,
} from '@plentyag/app-production/src/central-processing-dashboard-page/test-helpers';
import { dataTestids as dataTestIdsRefreshButton } from '@plentyag/brand-ui/src/components/refresh-button';
import { act, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { PreTransferConveyanceCard } from '.';

import { PickupBufferCard } from './components/pickup-buffer-card';
import { PickupPositionCard } from './components/pickup-position-card';
import { TransplanterCard } from './components/transplanter-card';
import { useLoadPreTransferConveyanceData } from './hooks/use-load-pre-transfer-convenyance-data';

const mockRevaliate = jest.fn();
jest.mock('./hooks/use-load-pre-transfer-convenyance-data');
const mockUseLoadPreTransferConveyanceData = useLoadPreTransferConveyanceData as jest.Mock;
mockUseLoadPreTransferConveyanceData.mockReturnValue({
  isLoading: false,
  revalidate: mockRevaliate,
  pickupBuffer: mockCarriers,
  transplanterTowers: mockTowers,
  transplanterOutfeedTowers: mockTransplanerOutfeedTowers,
});

jest.mock('./components/pickup-buffer-card');
const mockPickupBufferCard = PickupBufferCard as jest.Mock;
mockPickupBufferCard.mockReturnValue(<div />);

jest.mock('./components/pickup-position-card');
const mockPickupPositionCard = PickupPositionCard as jest.Mock;
mockPickupPositionCard.mockReturnValue(<div />);

jest.mock('./components/transplanter-card');
const mockTransplanterCard = TransplanterCard as jest.Mock;
mockTransplanterCard.mockReturnValue(<div />);

const mockRefreshInterval = 1000;

describe('PreTransferConveyanceCard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function renderPreTransferConveyanceCard() {
    return render(<PreTransferConveyanceCard refreshIntervalInMs={mockRefreshInterval} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  it('renders the 4 cards', () => {
    renderPreTransferConveyanceCard();

    expect(mockPickupBufferCard).toHaveBeenCalledTimes(1);
    expect(mockPickupBufferCard).toHaveBeenCalledWith(expect.objectContaining({ pickupBuffer: mockCarriers }), {});
    expect(mockPickupPositionCard).toHaveBeenCalledTimes(1);
    expect(mockPickupPositionCard).toHaveBeenCalledWith(expect.objectContaining({ pickupBuffer: mockCarriers }), {});
    expect(mockTransplanterCard).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        title: 'Transplanter Outfeed',
        towers: mockTransplanerOutfeedTowers,
      }),
      {}
    );
    expect(mockTransplanterCard).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        title: 'Transplanter',
        towers: mockTowers,
      }),
      {}
    );
  });

  it('refreshes the data when the reload button is clicked', () => {
    const { queryByTestId } = renderPreTransferConveyanceCard();

    // initial call
    expect(mockRevaliate).toHaveBeenCalledTimes(1);

    queryByTestId(dataTestIdsRefreshButton.button).click();

    expect(mockRevaliate).toHaveBeenCalledTimes(2);
  });

  it('reloads periodically', () => {
    renderPreTransferConveyanceCard();

    // initial call
    expect(mockRevaliate).toHaveBeenCalledTimes(1);

    // advance to time right before next refresh period and should not make request
    jest.advanceTimersByTime(mockRefreshInterval - 1);
    expect(mockRevaliate).toHaveBeenCalledTimes(1);

    // now advance time pass period and should make request
    act(() => jest.advanceTimersByTime(10));
    expect(mockRevaliate).toHaveBeenCalledTimes(2);
  });
});
