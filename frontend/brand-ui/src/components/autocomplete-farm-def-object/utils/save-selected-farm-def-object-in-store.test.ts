import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { FarmDefSite } from '@plentyag/core/src/farm-def/types';

import { AutocompleteFarmDefObjectActions, AutocompleteFarmDefObjectState } from '../hooks';

import { saveSelectedFarmDefObjectInStore } from '.';

const farmDefSiteWithoutChildren: FarmDefSite = {
  id: root.sites['SSF2'].id,
  kind: root.sites['SSF2'].kind,
  country: root.sites['SSF2'].country,
  address: root.sites['SSF2'].address,
  timezone: root.sites['SSF2'].timezone,
  path: root.sites['SSF2'].path,
  name: root.sites['SSF2'].name,
  properties: root.sites['SSF2'].properties,
};

describe('saveSelectedFarmDefObjectInStore', () => {
  it('sets the selectedFarmDefObject and inputValue to the object mapping to the given path', () => {
    const actions = {
      setSelectedFarmDefObject: jest.fn(),
      setInputvalue: jest.fn(),
    } as unknown as AutocompleteFarmDefObjectActions;

    const state = {
      farmDefObjects: [farmDefSiteWithoutChildren],
    } as unknown as AutocompleteFarmDefObjectState;

    saveSelectedFarmDefObjectInStore({
      actions,
      farmDefSite: root.sites['SSF2'],
      path: 'sites/SSF2/areas/Seeding',
      state,
    });

    expect(actions.setSelectedFarmDefObject).toHaveBeenCalledWith(root.sites['SSF2'].areas['Seeding']);
    expect(actions.setInputvalue).toHaveBeenCalledWith('SSF2/Seeding/');
  });

  it('sets the selectedFarmDefObject and inputValue to the object mapping to the given path (sites/SSF2)', () => {
    const actions = {
      setSelectedFarmDefObject: jest.fn(),
      setInputvalue: jest.fn(),
    } as unknown as AutocompleteFarmDefObjectActions;

    const state = {
      farmDefObjects: [farmDefSiteWithoutChildren],
    } as unknown as AutocompleteFarmDefObjectState;

    saveSelectedFarmDefObjectInStore({
      actions,
      farmDefSite: root.sites['SSF2'],
      path: 'sites/SSF2',
      state,
    });

    expect(actions.setSelectedFarmDefObject).toHaveBeenCalledWith(farmDefSiteWithoutChildren);
    expect(actions.setInputvalue).toHaveBeenCalledWith('SSF2/');
  });

  it('does not set the selectedFarmDefObject and inputValue when given an invalid path', () => {
    const actions = {
      setSelectedFarmDefObject: jest.fn(),
      setInputvalue: jest.fn(),
    } as unknown as AutocompleteFarmDefObjectActions;

    const state = {
      farmDefObjects: [farmDefSiteWithoutChildren],
    } as unknown as AutocompleteFarmDefObjectState;

    saveSelectedFarmDefObjectInStore({
      actions,
      farmDefSite: root.sites['SSF2'],
      path: 'sites/SSF',
      state,
    });

    expect(actions.setSelectedFarmDefObject).not.toHaveBeenCalled();
    expect(actions.setInputvalue).not.toHaveBeenCalled();
  });
});
