import { mockMapStateForTable, mockMapStateForTower } from '../../test-helpers/mock-map-state-data';

import { getResourceLoadedDate } from '.';

describe('getResourceLoadedDate', () => {
  it('returns loaded date from material attributes for Germination', () => {
    // ARRANGE
    const data = Object.values(mockMapStateForTable)[0] as any;

    // ACT
    const result = getResourceLoadedDate(data);

    // ASSERT
    const formattedPT = result.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', timeZoneName: 'short' });
    expect(formattedPT).toEqual('5/1/2022, 3:54:24 AM PDT');
  });

  it('returns loaded date from material attributes for Propagation', () => {
    // ARRANGE
    const data = Object.values(mockMapStateForTable)[0] as any;
    data.resourceState.location.machine.areaName = 'Propagation';

    // ACT
    const result = getResourceLoadedDate(data);

    // ASSERT
    const formattedPT = result.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', timeZoneName: 'short' });
    expect(formattedPT).toEqual('5/19/2022, 5:54:24 AM PDT');
  });

  it('returns loaded date from material attributes for Vertical Grow (even if lastLoadOperation is given)', () => {
    // ARRANGE
    const data = Object.values(mockMapStateForTower)[0] as any;
    data.lastLoadOperation = {
      startDt: '2020-12-10T18:13:57.000Z',
    };

    // ACT
    const result = getResourceLoadedDate(data);

    // ASSERT
    const formattedPT = result.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', timeZoneName: 'short' });
    expect(formattedPT).toEqual('4/16/2022, 5:54:24 AM PDT');
  });

  it('returns loaded date from last load operation (when there are no loaded in material attributes)', () => {
    // ARRANGE
    const data = Object.values(mockMapStateForTower)[0] as any;
    data.lastLoadOperation = {
      startDt: '2020-12-10T18:13:57.000Z',
    };
    delete data.resourceState.materialAttributes.loadedInGrowAt;

    // ACT
    const result = getResourceLoadedDate(data);

    // ASSERT
    const formattedPT = result.toLocaleString('en-US', { timeZone: 'America/Los_Angeles', timeZoneName: 'short' });
    expect(formattedPT).toEqual('12/10/2020, 10:13:57 AM PST');
  });

  it('returns null if material is not found', () => {
    // ARRANGE
    const data = Object.values(mockMapStateForTower)[0] as any;
    delete data.resourceState.materialObj;
    data.lastLoadOperation = {
      startDt: '2020-12-10T18:13:57.000Z',
    };

    // ACT
    const result = getResourceLoadedDate(data);

    // ASSERT
    expect(result).toEqual(null);
  });

  it('returns null if resourceState is not found', () => {
    // ARRANGE
    const data = Object.values(mockMapStateForTower)[0] as any;
    delete data.resourceState;

    // ACT
    const result = getResourceLoadedDate(data);

    // ASSERT
    expect(result).toEqual(null);
  });
});
