import { parseErrorMessage } from '@plentyag/core/src/utils/parse-error-message';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import axios from 'axios';
import { Store } from 'use-global-hook';

import { initialState, SearchState } from './state';

export interface SearchActions {
  refreshSearch: () => void;
  search: (searchTerm: string) => void;
  setSearch: (ProdResources: ProdResources.ResourceState, searchTerm: string) => void;
  resetSearch: () => void;
}

export interface TowerCycleResponse {
  towerId: string;
  cycleCount: number;
}

export const getStateByIdUrl = (searchTerm: string) => `/api/plentyservice/traceability3/get-state-by-id/${searchTerm}`;

export const getTowerCycleCount = (id: string) => `/api/plentyservice/traceability3/get-tower-cycles-for-tower/${id}`;

interface SearchActionsBoundToStore {
  refreshSearch: (store: SearchStore) => void;
  search: (store: SearchStore, searchTerm: string) => void;
  setSearch: (store: SearchStore, ProdResources: ProdResources.ResourceState, searchTerm: string) => void;
  resetSearch: (store: SearchStore) => void;
}

type SearchStore = Store<SearchState, SearchActions>;

const mergeSearchStates = (state: SearchState, nextState: Partial<SearchState>): SearchState => {
  Object.keys(nextState).forEach(key => {
    state[key] = nextState[key];
  });
  return state;
};

const cancelSearch = (store: SearchStore) => {
  if (store.state.isSearching && store.state.cancellationSource) {
    store.state.cancellationSource.cancel('search canceled');
  }
};

const search = async (store: SearchStore, searchTerm: string) => {
  cancelSearch(store);

  if (!searchTerm) {
    // clear search
    store.setState(
      mergeSearchStates(store.state, {
        cancellationSource: null,
        lastSearchTerm: '',
        isSearching: false,
        searchResult: null,
        searchError: null,
      })
    );
    return;
  }

  const source = axios.CancelToken.source();

  const nextState: Partial<SearchState> = {
    cancellationSource: source,
    isSearching: true,
    searchError: null,
    lastSearchTerm: searchTerm,
  };

  const clearSearchOnNewSearchTerm = searchTerm !== store.state.lastSearchTerm;
  if (clearSearchOnNewSearchTerm) {
    nextState.searchResult = null;
  }

  store.setState(mergeSearchStates(store.state, nextState));

  try {
    const url = getStateByIdUrl(searchTerm);
    const { data } = await axiosRequest<ProdResources.ResourceState>({ url, cancelToken: source.token });

    if (data.containerObj?.containerType?.toUpperCase() === 'TOWER') {
      const towerCyclesData = await axiosRequest<TowerCycleResponse>({
        method: 'GET',
        url: getTowerCycleCount(data.containerObj.serial),
      });

      data.towerCycles = towerCyclesData.data.cycleCount;
    }

    store.setState(
      mergeSearchStates(store.state, {
        lastSearchTerm: searchTerm,
        isSearching: false,
        searchResult: data,
      })
    );
  } catch (error) {
    if (!axios.isCancel(error)) {
      store.setState(
        mergeSearchStates(store.state, {
          lastSearchTerm: searchTerm,
          isSearching: false,
          searchError: parseErrorMessage(error),
        })
      );
    }
  }
};

const refreshSearch = async (store: SearchStore) => {
  if (store.state.lastSearchTerm) {
    await search(store, store.state.lastSearchTerm);
  }
};

const setSearch = (store: SearchStore, state: ProdResources.ResourceState, searchTerm: string) => {
  if (state && searchTerm) {
    cancelSearch(store);
    store.setState(
      mergeSearchStates(store.state, {
        cancellationSource: null,
        searchResult: state,
        isSearching: false,
        searchError: null,
        lastSearchTerm: searchTerm,
      })
    );
  }
};

const resetSearch = (store: SearchStore) => {
  store.setState({ ...initialState });
};

export const actions: SearchActionsBoundToStore = {
  refreshSearch,
  search,
  setSearch,
  resetSearch,
};
