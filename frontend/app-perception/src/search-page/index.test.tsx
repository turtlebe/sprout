import { mockFakeResults } from '@plentyag/app-perception/src/common/test-helpers/mocks';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsSearchPage as dataTestIds, SearchPage } from '.';

import { usePerceptionState } from './use-perception-state';

jest.mock('./use-perception-state');

const mockUsePerceptionState = usePerceptionState as jest.Mock;

const renderPerception = () => {
  return render(<SearchPage />, {
    wrapper: props => <MemoryRouter {...props} />,
  });
};

describe('Perception', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the Table and tableRow based on the test results data', () => {
    mockUsePerceptionState.mockReturnValue({
      results: mockFakeResults,
      loading: false,
      error: null,
      currentPage: 1,
      setCurrentPage: jest.fn(),
      totalPages: 1,
      currentView: 'grid',
      setCurrentView: jest.fn(),
      searchFields: null,
      setSearchFields: jest.fn(),
    });

    const { queryByTestId } = renderPerception();

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.rightNav)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.searchResult)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.trials)).toBeInTheDocument();
  });

  it('always shows the options in left navigation bar', () => {
    mockUsePerceptionState.mockReturnValue({
      results: null,
      loading: false,
      error: null,
      currentPage: 1,
      setCurrentPage: jest.fn(),
      totalPages: 1,
      currentView: 'grid',
      setCurrentView: jest.fn(),
      searchFields: null,
      setSearchFields: jest.fn(),
    });

    const { queryByTestId } = renderPerception();

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.rightNav)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.searchResult)).toBeInTheDocument();
  });
});
