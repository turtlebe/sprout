import { CancelTokenSource } from 'axios';

export interface SearchState {
  lastSearchTerm: string;
  searchResult: ProdResources.ResourceState;
  isSearching: boolean;
  cancellationSource: CancelTokenSource;
  searchError: string;
}

export const initialState: SearchState = {
  cancellationSource: null,
  lastSearchTerm: undefined,
  searchResult: null,
  isSearching: false,
  searchError: null,
};
