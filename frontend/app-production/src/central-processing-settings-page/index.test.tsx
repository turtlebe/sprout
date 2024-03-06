import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { CentralProcessingSettingsPage, dataTestIdsCentralProcessingSettingsPage as dataTestIds } from '.';

import { dataTestIdsTransferConveyanceSettings } from './components/transfer-conveyance-settings';

mockCurrentUser();

describe('CentralProcessingSettingsPage', () => {
  function renderCentralProcessingSettingsPage() {
    return render(<CentralProcessingSettingsPage />);
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderCentralProcessingSettingsPage();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });

  describe('tabs', () => {
    it('goes to the correct transfer convyance settings page when tab is pressed', async () => {
      // ARRANGE
      const { queryByTestId } = renderCentralProcessingSettingsPage();

      // ACT
      await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIds.cpSettingsTab)));

      // ASSERT
      expect(queryByTestId(dataTestIdsTransferConveyanceSettings.root)).toBeInTheDocument();
    });
  });
});
