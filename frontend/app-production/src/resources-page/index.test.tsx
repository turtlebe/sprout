import { AppProductionTestWrapper, mockBasePath } from '@plentyag/app-production/src/common/test-helpers';
import { act, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';

import { dataTestIds, ResourcesPage } from './index';

import { mockResult, mockResultContainerOnly, mockResultMaterialOnly } from './components/search/mock-search-result';
import { useSearch } from './hooks/use-search';

jest.mock('./hooks/use-search');
const mockUseSearch = useSearch as jest.Mock;

jest.mock('./components/header', () => {
  const fakeHeader = () => <div />;
  return { Header: fakeHeader };
});

const mockResourceInfoDataTestId = 'fake-resource-info';
jest.mock('./components/resource-info', () => {
  const fakeResourceInfo = () => <div data-testid={mockResourceInfoDataTestId} />;
  return { ResourceInfo: fakeResourceInfo };
});

const mockGenealogyDataTestId = 'fake-genealogy';
jest.mock('./components/genealogy', () => {
  const fakeGenealogy = () => <div data-testid={mockGenealogyDataTestId} />;
  return { Genealogy: fakeGenealogy };
});

jest.mock('./hooks/use-search-query-parameter');

const baseResourcesPath = `${mockBasePath}/resources`;

describe('Resource', () => {
  function renderResourcesPage(mockSearchResult) {
    const refreshSearchMock = jest.fn();
    const resetSearchMock = jest.fn();

    mockUseSearch.mockReturnValue([
      { isSearching: false, searchResult: mockSearchResult },
      { refreshSearch: refreshSearchMock, resetSearch: resetSearchMock },
    ]);

    const path = `${baseResourcesPath}/info`;

    const history = createMemoryHistory({ initialEntries: [path] });

    const location = {
      search: '',
      hash: '',
      pathname: path,
      state: undefined,
    };

    const match = {
      isExact: true,
      params: { tab: 'info' },
      path: path,
      url: path,
    };
    const renderResult = render(<ResourcesPage history={history} location={location} match={match} />, {
      wrapper: ({ children }) => <AppProductionTestWrapper history={history}>{children}</AppProductionTestWrapper>,
    });

    return { history, refreshSearchMock, resetSearchMock, ...renderResult };
  }

  it('sets tab to "info" from url path', () => {
    const { queryByTestId } = renderResourcesPage(mockResult);

    const infoTab = queryByTestId(dataTestIds.info);
    expect(infoTab).toBeInTheDocument();

    const resourceInfo = queryByTestId(mockResourceInfoDataTestId);
    expect(resourceInfo).toBeInTheDocument();
  });

  it('shows only certain tabs for resource with only "container"', () => {
    const { queryByTestId } = renderResourcesPage(mockResultContainerOnly);

    const infoTab = queryByTestId(dataTestIds.info);
    expect(infoTab).toBeInTheDocument();

    const genealogyTab = queryByTestId(dataTestIds.genealogy);
    expect(genealogyTab).toBeInTheDocument();

    const materialHistoryTab = queryByTestId(dataTestIds.materialHistory);
    expect(materialHistoryTab).not.toBeInTheDocument();

    const containerHistoryTab = queryByTestId(dataTestIds.containerHistory);
    expect(containerHistoryTab).toBeInTheDocument();
  });

  it('shows only certain tabs for resouce with only "material"', () => {
    const { queryByTestId } = renderResourcesPage(mockResultMaterialOnly);

    const infoTab = queryByTestId(dataTestIds.info);
    expect(infoTab).toBeInTheDocument();

    const genealogyTab = queryByTestId(dataTestIds.genealogy);
    expect(genealogyTab).toBeInTheDocument();

    const materialHistoryTab = queryByTestId(dataTestIds.materialHistory);
    expect(materialHistoryTab).toBeInTheDocument();

    const containerHistoryTab = queryByTestId(dataTestIds.containerHistory);
    expect(containerHistoryTab).not.toBeInTheDocument();
  });

  it('refreshes search when tab changes and creates new tab panel', () => {
    const { history, refreshSearchMock, queryByTestId } = renderResourcesPage(mockResultMaterialOnly);

    expect(queryByTestId(mockGenealogyDataTestId)).toBeNull();
    expect(queryByTestId(mockResourceInfoDataTestId)).toBeInTheDocument();

    act(() => {
      const genealogyTab = queryByTestId(dataTestIds.genealogy);
      genealogyTab.click();
    });

    expect(queryByTestId(mockGenealogyDataTestId)).toBeInTheDocument();
    expect(queryByTestId(mockResourceInfoDataTestId)).not.toBeInTheDocument();

    expect(refreshSearchMock).toHaveBeenCalledWith();

    expect(history.location.pathname).toBe(`${baseResourcesPath}/genealogy`);
  });

  it('resets search state when unmounted', () => {
    const { unmount, resetSearchMock } = renderResourcesPage(mockResultMaterialOnly);
    expect(resetSearchMock).not.toHaveBeenCalled();
    unmount();
    expect(resetSearchMock).toHaveBeenCalled();
  });
});
