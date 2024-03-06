import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { BaseAgGridInfiniteTable } from '@plentyag/brand-ui/src/components/base-ag-grid-table';
import { render } from '@testing-library/react';
import React from 'react';

import { useSearch } from '../../hooks/use-search';
import { mockResultContainerOnly, mockResultMaterialOnly } from '..//search/mock-search-result';

import { dataTestIdsHistory as dataTestIds, History } from '.';

jest.mock('../../hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;

jest.mock('@plentyag/brand-ui/src/components/base-ag-grid-table');
const mockBaseAgGridClientSideTable = BaseAgGridInfiniteTable as jest.Mock;
mockBaseAgGridClientSideTable.mockReturnValue(<div></div>);

describe('History', () => {
  beforeEach(() => {
    mockUseSearch.mockClear();
  });

  function renderHistory(historyType: History['historyType']) {
    return render(<History historyType={historyType} />, {
      wrapper: AppProductionTestWrapper,
    });
  }

  it('renders nothing when search result has no container and history type is container', () => {
    mockUseSearch.mockReturnValue([mockResultMaterialOnly]);

    const { queryByTestId } = renderHistory('container');
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders nothing when search result has no material and history type is material', () => {
    mockUseSearch.mockReturnValue([mockResultContainerOnly]);

    const { queryByTestId } = renderHistory('material');
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders nothing when there is no search result', () => {
    mockUseSearch.mockReturnValue([undefined]);

    const { queryByTestId } = renderHistory('material');
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });

  it('renders when has search result and container id', () => {
    mockUseSearch.mockReturnValue([mockResultContainerOnly]);

    const { queryByTestId } = renderHistory('container');
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });
});
