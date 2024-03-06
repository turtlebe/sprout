import React from 'react';
import globalHook from 'use-global-hook';

import { actions, SearchActions as SearchActionsType } from './actions';
import { initialState, SearchState as SearchStateType } from './state';

export type SearchState = SearchStateType;
export type SearchActions = SearchActionsType;

export const useSearch = globalHook<SearchState, SearchActions>(React, { ...initialState }, actions);
