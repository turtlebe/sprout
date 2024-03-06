import { QueryParameterProvider } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import { mockMapsState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { chooseFromAutocomplete, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsSelectCrops as dataTestIds, SelectCrops } from '.';

describe('SelectCrops', () => {
  function renderSelectCrops(defaultQueryParameters = mockDefaultQueryParameters) {
    return render(<SelectCrops mapsState={mockMapsState} />, {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <QueryParameterProvider defaultParameters={defaultQueryParameters}>{children}</QueryParameterProvider>
        </MemoryRouter>
      ),
    });
  }

  it('sorts options list of all crops from the current mapsState', async () => {
    const { queryByTestId, queryAllByRole } = renderSelectCrops();

    const autoCompleteInput = queryByTestId(dataTestIds.autocomplete).querySelector('input');

    await actAndAwait(() => openAutocomplete(autoCompleteInput));

    const options = queryAllByRole('option');

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('BAC');
    expect(options[1]).toHaveTextContent('WHC');
  });

  function getAutocompleteSelectedItems(queryByTestId) {
    return queryByTestId(dataTestIds.autocomplete).querySelectorAll('.MuiChip-root');
  }

  it('selects items', async () => {
    const { queryByTestId } = renderSelectCrops();

    const autoCompleteInput = queryByTestId(dataTestIds.autocomplete).querySelector('input');

    const initialSelectedItems = getAutocompleteSelectedItems(queryByTestId);
    expect(initialSelectedItems).toHaveLength(0);

    await actAndAwait(() => openAutocomplete(autoCompleteInput));
    await actAndAwait(() => chooseFromAutocomplete('BAC'));
    const selectedItems = getAutocompleteSelectedItems(queryByTestId);
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0]).toHaveTextContent('BAC');

    await actAndAwait(() => openAutocomplete(autoCompleteInput));
    await actAndAwait(() => chooseFromAutocomplete('WHC'));
    const selectedItemsAfterSecondSelection = getAutocompleteSelectedItems(queryByTestId);
    expect(selectedItemsAfterSecondSelection).toHaveLength(2);
    expect(selectedItemsAfterSecondSelection[0]).toHaveTextContent('BAC');
    expect(selectedItemsAfterSecondSelection[1]).toHaveTextContent('WHC');
  });

  it('sets initial selectedCrops from query parameter', () => {
    const { queryByTestId } = renderSelectCrops({ ...mockDefaultQueryParameters, selectedCrops: ['BAC', 'WHC'] });

    const selectedItems = getAutocompleteSelectedItems(queryByTestId);
    expect(selectedItems).toHaveLength(2);
    expect(selectedItems[0]).toHaveTextContent('BAC');
    expect(selectedItems[1]).toHaveTextContent('WHC');
  });
});
