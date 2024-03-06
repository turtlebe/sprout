import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { changeTextField } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { act, render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Route } from 'react-router-dom';

import { ActionsSearchPage, dataTestIdsActionSearchPage as dataTestIds } from './index';

import { dataTestIdsActionCard } from './components';
import { searchResult } from './mock-action-search';

const currentFarmDefPath = 'sites/SSF2/farms/Tigris';
mockCurrentUser({ currentFarmDefPath });

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
mockUseSwrAxios.mockImplementation(() => {
  return {
    isValidating: false,
    data: searchResult,
  };
});

const baseActionsPath = `${mockBasePath}/actions`;

describe('ActionsSearch', () => {
  function renderActionsSearch() {
    const initialEntries = [`${baseActionsPath}`];
    const history = createMemoryHistory({ initialEntries });
    return render(<Route exact component={ActionsSearchPage} />, {
      wrapper: ({ children }) => <AppProductionTestWrapper history={history}>{children}</AppProductionTestWrapper>,
    });
  }

  it('renders search result items', () => {
    const { queryByTestId, queryAllByTestId } = renderActionsSearch();
    const cards = queryByTestId(dataTestIds.cards);
    expect(cards.children.length).toBe(16);

    // sorted by name
    const cardHeaders = queryAllByTestId(dataTestIdsActionCard.header);
    expect(cardHeaders).toHaveLength(16);
    expect(cardHeaders[0]).toHaveTextContent('Blending Prescription Updated');
    expect(cardHeaders[15]).toHaveTextContent('Yield Loss Registered');
  });

  it('renders subset of search result items', async () => {
    const { queryByTestId } = renderActionsSearch();

    act(() => changeTextField(dataTestIds.searchTerm, 'Tote Filled'));

    await waitFor(() => expect(queryByTestId(dataTestIds.cards).children.length).toBe(1));
  });

  it('renders a message if no matching actions', () => {
    const { queryByTestId } = renderActionsSearch();

    act(() => changeTextField(dataTestIds.searchTerm, 'Non-Existent'));

    const msg = queryByTestId(dataTestIds.noMatchMessage);
    expect(msg).toBeTruthy();
  });

  it('renders header with site/farm name', () => {
    const { queryByTestId } = renderActionsSearch();

    expect(queryByTestId(dataTestIds.header)).toHaveTextContent(getShortenedPath(currentFarmDefPath));
  });
});
