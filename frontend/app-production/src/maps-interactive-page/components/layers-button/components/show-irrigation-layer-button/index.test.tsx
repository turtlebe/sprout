import { QueryParameterProvider } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsShowIrrigationLayerButton as dataTestIds, ShowIrrigationLayerButton } from '.';

describe('ShowIrrigationLayerButton', () => {
  function renderShowIrrigationLayerButton() {
    return render(<ShowIrrigationLayerButton />, {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <QueryParameterProvider defaultParameters={mockDefaultQueryParameters}>{children}</QueryParameterProvider>
        </MemoryRouter>
      ),
    });
  }

  it('sets initial value from query parameters', () => {
    const { queryByTestId } = renderShowIrrigationLayerButton();

    const switchInput = queryByTestId(dataTestIds.switch).querySelector('input');

    expect(switchInput).not.toBeChecked();
  });

  it('updates from switch value from query parameterse after change', () => {
    const { queryByTestId } = renderShowIrrigationLayerButton();

    const switchInput = queryByTestId(dataTestIds.switch).querySelector('input');

    expect(switchInput).not.toBeChecked();

    switchInput.click();

    expect(switchInput).toBeChecked();
  });
});
