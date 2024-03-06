import { renderHook } from '@testing-library/react-hooks';

import { mockResultContainerOnly, mockResultMaterialOnly } from '../../components/search/mock-search-result';

import { useResetTabWhenNoHistory } from '.';

describe('useResetTabWhenNoHistory', () => {
  it('calls setTab when there is no container history', () => {
    const mockSetTab = jest.fn();
    renderHook(() =>
      useResetTabWhenNoHistory({
        searchResult: mockResultMaterialOnly,
        currTab: 'container-history',
        setTab: mockSetTab,
      })
    );

    expect(mockSetTab).toHaveBeenCalledWith('info');
  });

  it('calls setTab when there is material history', () => {
    const mockSetTab = jest.fn();
    renderHook(() =>
      useResetTabWhenNoHistory({
        searchResult: mockResultContainerOnly,
        currTab: 'material-history',
        setTab: mockSetTab,
      })
    );

    expect(mockSetTab).toHaveBeenCalledWith('info');
  });

  it('does not call setTab when current tab is not a history tab', () => {
    const mockSetTab = jest.fn();
    renderHook(() =>
      useResetTabWhenNoHistory({
        searchResult: mockResultContainerOnly,
        currTab: 'info',
        setTab: mockSetTab,
      })
    );

    expect(mockSetTab).not.toHaveBeenCalledWith('info');
  });

  it('does not call setTab when there is no search result', () => {
    const mockSetTab = jest.fn();
    renderHook(() =>
      useResetTabWhenNoHistory({
        searchResult: undefined,
        currTab: 'material-history',
        setTab: mockSetTab,
      })
    );

    expect(mockSetTab).not.toHaveBeenCalledWith('info');
  });

  it('does not call setTab has container history and current atb is "container-history"', () => {
    const mockSetTab = jest.fn();
    renderHook(() =>
      useResetTabWhenNoHistory({
        searchResult: mockResultContainerOnly,
        currTab: 'container-history',
        setTab: mockSetTab,
      })
    );

    expect(mockSetTab).not.toHaveBeenCalledWith('info');
  });
});
