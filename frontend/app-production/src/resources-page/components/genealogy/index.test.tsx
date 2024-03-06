import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { render } from '@testing-library/react';
import React from 'react';

import { useSearch } from '../../hooks/use-search';
import { mockResultContainerOnly } from '../search/mock-search-result';

import { dataTestIds, Genealogy } from '.';

import { useGenealogy } from './hooks/use-genealogy';

mockGlobalSnackbar();

jest.mock('../../hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;
mockUseSearch.mockReturnValue([{ isSearching: false, searchResult: mockResultContainerOnly }]);

jest.mock('./hooks/use-genealogy');
const mockUseGenealogy = useGenealogy as jest.Mock;
mockUseGenealogy.mockReturnValue({ isLoading: false, data: undefined });

describe('Genealogy', () => {
  it('shows message when resource with no material is provided.', () => {
    const { queryByTestId } = render(<Genealogy />);
    expect(queryByTestId(dataTestIds.noMaterialMessage)).toBeInTheDocument();
  });
});
