import { QueryParameterProvider } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsShowCommentsLayerButton as dataTestIds, ShowCommentsLayerButton } from '.';

describe('ShowCommentsLayerButton', () => {
  function renderShowCommentsLayerButton() {
    return render(<ShowCommentsLayerButton />, {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <QueryParameterProvider defaultParameters={mockDefaultQueryParameters}>{children}</QueryParameterProvider>
        </MemoryRouter>
      ),
    });
  }

  it('sets initial value from query parameters', () => {
    const { queryByTestId } = renderShowCommentsLayerButton();

    const switchInput = queryByTestId(dataTestIds.switch).querySelector('input');

    expect(switchInput).not.toBeChecked();
  });

  it('updates from switch value from query parameters after change', () => {
    const { queryByTestId } = renderShowCommentsLayerButton();

    const switchInput = queryByTestId(dataTestIds.switch).querySelector('input');

    expect(switchInput).not.toBeChecked();

    switchInput.click();

    expect(switchInput).toBeChecked();
  });
});
