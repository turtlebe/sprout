import React from 'react';
import globalHook, { Store } from 'use-global-hook';

import actions from './actions';
import { initialState } from './state';

export type LabelingStore = Store<IL.LabelingState, IL.LabelingActions>;

// use this hook to access state and actions for image labeing.
export const useLabelingStore = globalHook<IL.LabelingState, IL.LabelingActions>(React, initialState, actions);

export default useLabelingStore;
