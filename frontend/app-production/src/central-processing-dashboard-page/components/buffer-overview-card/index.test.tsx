import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { dataTestids as dataTestIdsRefreshButton } from '@plentyag/brand-ui/src/components/refresh-button';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { act, render } from '@testing-library/react';
import React from 'react';

import { mockBufferCarriers } from '../../test-helpers/mock-carrier';
import { InlineDestinationAction } from '../inline-destination-action';

import { BufferOverviewCard, dataTestIdsBufferOverviewCard as dataTestIds } from '.';

jest.mock('../inline-destination-action');
const MockInlineDestinationAction = InlineDestinationAction as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockRefreshInterval = 1000;

describe('BufferOverviewCard', () => {
  beforeEach(() => {
    MockInlineDestinationAction.mockImplementation(({ children }) => <div>{children}</div>);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function renderBufferOverviewCard() {
    return render(
      <BufferOverviewCard
        refreshIntervalInMs={mockRefreshInterval}
        apiUrl="/api/production/transfer-conveyance/buffers/states/seedling-buffer"
        title="Seedling Buffer Overview"
      />,
      {
        wrapper: AppProductionTestWrapper,
      }
    );
  }

  it('renders card with buffer data', () => {
    mockUseSwrAxios.mockReturnValue({
      isValidating: false,
      revalidate: jest.fn(),
      error: null,
      data: mockBufferCarriers,
    });
    const { queryByTestId } = renderBufferOverviewCard();

    expect(queryByTestId(dataTestIds.table)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('Seedling Buffer Overview');
    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/production/transfer-conveyance/buffers/states/seedling-buffer',
      })
    );
  });

  it('reloads data when refresh button is clicked', () => {
    const mockRevalidate = jest.fn();
    mockUseSwrAxios.mockReturnValue({
      isValidating: false,
      error: null,
      data: [],
      revalidate: mockRevalidate,
    });

    const { queryByTestId } = renderBufferOverviewCard();

    // initial call
    expect(mockRevalidate).toHaveBeenCalled();
    mockRevalidate.mockClear();

    queryByTestId(dataTestIdsRefreshButton.button).click();

    expect(mockRevalidate).toHaveBeenCalled();
  });

  it('reloads periodically', () => {
    const mockRevalidate = jest.fn();
    mockUseSwrAxios.mockReturnValue({
      isValidating: false,
      error: null,
      data: [],
      revalidate: mockRevalidate,
    });

    renderBufferOverviewCard();

    // initial call
    expect(mockRevalidate).toHaveBeenCalled();
    mockRevalidate.mockClear();

    // advance to time right before next refresh period and should not make request
    jest.advanceTimersByTime(mockRefreshInterval - 1);
    expect(mockRevalidate).not.toHaveBeenCalled();

    // now advance time pass period and should make request
    act(() => jest.advanceTimersByTime(10));
    expect(mockRevalidate).toHaveBeenCalled();
  });
});
