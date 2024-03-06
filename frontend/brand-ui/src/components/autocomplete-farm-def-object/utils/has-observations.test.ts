import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';

import { AutocompleteFarmDefObjectState, initialScopedState } from '../hooks/use-autocomplete-farm-def-object-store';

import { hasObservations } from './has-observations';

const state = {
  ...initialScopedState,
  treeObservationGroups: { count: 0, children: {} },
} as unknown as AutocompleteFarmDefObjectState;

const stateWithTree = {
  ...initialScopedState,
  treeObservationGroups: { count: 0, children: { 'sites/SSF2': { count: 1, children: {} } } },
} as unknown as AutocompleteFarmDefObjectState;

describe('hasObservations', () => {
  it('returns false', () => {
    expect(hasObservations(root.sites['SSF2'], state)).toBe(false);
  });

  it('returns true', () => {
    expect(hasObservations(root.sites['SSF2'], stateWithTree)).toBe(true);
  });
});
