import { mockDefaultQueryParameters } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-default-query-parameters';
import {
  mockContainerLocationRefWithLabels,
  mockMapsState,
  mockMapsStateWithLabels,
  mockMapsStateWithLoadDataLastLoadOperation,
  mockMapsStateWithLoadDataMaterialAttributes,
  testLabels,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { DateTime } from 'luxon';

import { filterMapsState } from '.';

describe('filterMapsState', () => {
  it('returns input maps state when no filters are applied', () => {
    expect(
      filterMapsState({
        mapsState: mockMapsStateWithLoadDataLastLoadOperation,
        queryParameters: mockDefaultQueryParameters,
      })
    ).toEqual(mockMapsStateWithLoadDataLastLoadOperation);
  });

  it('returns filtered maps state when crops and labels filters are applied', () => {
    expect(
      filterMapsState({
        mapsState: mockMapsStateWithLabels,
        queryParameters: {
          ...mockDefaultQueryParameters,
          selectedCrops: ['BAC'],
          selectedLabels: [testLabels[0]],
        },
      })
    ).toEqual({
      [mockContainerLocationRefWithLabels]: mockMapsStateWithLabels[mockContainerLocationRefWithLabels],
    });
  });

  it('returns filtered maps state when all filters are applied', () => {
    const selectedAgeCohortDate = DateTime.fromISO('2021-02-11T00:10:36.582Z').toJSDate();

    expect(
      filterMapsState({
        mapsState: mockMapsStateWithLabels,
        queryParameters: {
          ...mockDefaultQueryParameters,
          ageCohortDate: selectedAgeCohortDate,
          selectedCrops: ['BAC'],
          selectedLabels: [testLabels[0]],
        },
      })
    ).toEqual({}); // returns empty object since no maps state matches all three filters
  });

  it('returns filtered maps state when only ageCohortDate filter is applied', () => {
    const selectedAgeCohortDate = DateTime.fromISO('2021-02-11T00:10:36.582Z').toJSDate();

    expect(
      filterMapsState({
        mapsState: mockMapsStateWithLoadDataMaterialAttributes,
        queryParameters: {
          ...mockDefaultQueryParameters,
          ageCohortDate: selectedAgeCohortDate,
        },
      })
    ).toEqual({
      ['1143ff3f-f807-4d47-a2af-31013e1d81fa:containerLocation-Bay7']:
        mockMapsStateWithLoadDataMaterialAttributes['1143ff3f-f807-4d47-a2af-31013e1d81fa:containerLocation-Bay7'],
    });
  });

  it('returns filtered maps state when only selectedCrops filter is applied', () => {
    const keys = Object.keys(mockMapsState);

    // first three items in mock data should have BAC
    const mapsStateWithBac = {
      [keys[0]]: mockMapsState[keys[0]],
      [keys[1]]: mockMapsState[keys[1]],
      [keys[2]]: mockMapsState[keys[2]],
    };

    expect(
      filterMapsState({
        mapsState: mockMapsState,
        queryParameters: {
          ...mockDefaultQueryParameters,
          selectedCrops: ['BAC'],
        },
      })
    ).toEqual(mapsStateWithBac);
  });

  it('returns filtered maps state when only selectedLabels filter is applied', () => {
    expect(
      filterMapsState({
        mapsState: mockMapsStateWithLabels,
        queryParameters: {
          ...mockDefaultQueryParameters,
          selectedLabels: [testLabels[1]],
        },
      })
    ).toEqual({
      [mockContainerLocationRefWithLabels]: mockMapsStateWithLabels[mockContainerLocationRefWithLabels],
    });
  });
});
