import { QueryParameterProvider } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import {
  mockMapsStateWithLabels,
  testLabels,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { chooseFromAutocomplete, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsSelectLabels as dataTestIds, SelectLabels } from '.';

describe('SelectLabels', () => {
  function renderSelectLabels(defaultQueryParameters = mockDefaultQueryParameters) {
    return render(<SelectLabels mapsState={mockMapsStateWithLabels} />, {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <QueryParameterProvider defaultParameters={defaultQueryParameters}>{children}</QueryParameterProvider>
        </MemoryRouter>
      ),
    });
  }

  it('sorts options list of all labels from the current mapsState', async () => {
    const { queryByTestId, queryAllByRole } = renderSelectLabels();

    const autoCompleteInput = queryByTestId(dataTestIds.autocomplete).querySelector('input');

    await actAndAwait(() => openAutocomplete(autoCompleteInput));

    const options = queryAllByRole('option');

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent(testLabels[0]);
    expect(options[1]).toHaveTextContent(testLabels[1]);
  });

  function getAutocompleteSelectedItems(queryByTestId) {
    return queryByTestId(dataTestIds.autocomplete).querySelectorAll('.MuiChip-root');
  }

  it('selects items', async () => {
    const { queryByTestId } = renderSelectLabels();

    const autoCompleteInput = queryByTestId(dataTestIds.autocomplete).querySelector('input');

    const initialSelectedItems = getAutocompleteSelectedItems(queryByTestId);
    expect(initialSelectedItems).toHaveLength(0);

    await actAndAwait(() => openAutocomplete(autoCompleteInput));
    await actAndAwait(() => chooseFromAutocomplete(testLabels[0]));
    const selectedItems = getAutocompleteSelectedItems(queryByTestId);
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0]).toHaveTextContent(testLabels[0]);

    await actAndAwait(() => openAutocomplete(autoCompleteInput));
    await actAndAwait(() => chooseFromAutocomplete(testLabels[1]));
    const selectedItemsAfterSecondSelection = getAutocompleteSelectedItems(queryByTestId);
    expect(selectedItemsAfterSecondSelection).toHaveLength(2);
    expect(selectedItemsAfterSecondSelection[0]).toHaveTextContent(testLabels[0]);
    expect(selectedItemsAfterSecondSelection[1]).toHaveTextContent(testLabels[1]);
  });

  it('sets initial selectedLabels from query parameter', () => {
    const { queryByTestId } = renderSelectLabels({
      ...mockDefaultQueryParameters,
      selectedLabels: [testLabels[0], testLabels[1]],
    });

    const selectedItems = getAutocompleteSelectedItems(queryByTestId);
    expect(selectedItems).toHaveLength(2);
    expect(selectedItems[0]).toHaveTextContent(testLabels[0]);
    expect(selectedItems[1]).toHaveTextContent(testLabels[1]);
  });
});
