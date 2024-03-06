import { mockContainersResourceState } from '@plentyag/app-production/src/common/test-helpers';
import { LoadedAtAttributes } from '@plentyag/app-production/src/common/types/farm-state';
import { cloneDeep } from 'lodash';

import { getEditableLoadAtAttributes } from '.';

describe('getEditableLoadAtAttributes', () => {
  let mockResourceState;

  beforeEach(() => {
    mockResourceState = cloneDeep(mockContainersResourceState[0]);
    mockResourceState.materialObj = {
      createdAt: '2022-09-22T06:16:36.778Z',
      id: 'd8119b6d-83e0-4809-8a47-19bc4d8fd978',
      lotName: '535f304d-01e3-4c2f-94af-47701ba35a0a',
      materialType: 'LOADED_TABLE',
      product: 'BAC',
      properties: {},
      updatedAt: '2022-09-22T06:16:36.778Z',
    };
  });

  describe('testing resource state with missing properties', () => {
    function buildMockResource(newValues: Partial<ProdResources.ResourceState>) {
      return {
        ...mockResourceState,
        ...newValues,
      };
    }

    it.each([
      ['resource state', undefined],
      ['location', { location: undefined }],
      ['container', { containerObj: undefined }],
    ])('should gracefully return empty array when %s is undefined', (_text, resourceStateNewValues) => {
      // ARRANGE
      const resourceState =
        resourceStateNewValues === undefined ? undefined : buildMockResource(resourceStateNewValues);

      // ACT
      const result = getEditableLoadAtAttributes(resourceState);

      // ASSERT
      expect(result).toEqual([]);
    });
  });

  describe('testing happy paths', () => {
    function getMockResourceState(containerType, areaName) {
      mockResourceState.containerObj.containerType = containerType;
      mockResourceState.location.machine.areaName = areaName;
      return mockResourceState;
    }

    it.each([
      ['TABLE', 'Germination', [LoadedAtAttributes.LOADED_IN_GERM_AT]],
      ['TABLE', 'Propagation', [LoadedAtAttributes.LOADED_IN_GERM_AT, LoadedAtAttributes.LOADED_IN_PROP_AT]],
      ['TOWER', 'VerticalGrow', [LoadedAtAttributes.LOADED_IN_GROW_AT]],
      ['TABLE', 'TowerAutomation', []],
    ])('returns the loaded at attributes for a %s in %s', (containerType, areaName, expectedLoadedAtAttributes) => {
      // ARRANGE
      const resourceState = getMockResourceState(containerType, areaName);

      // ACT
      const result = getEditableLoadAtAttributes(resourceState);

      // ASSERT
      expect(result).toEqual(expectedLoadedAtAttributes);
    });

    it('should gracefully return the loaded at attributes for empty container', () => {
      // ARRANGE
      const resourceState = {
        ...mockResourceState,
        materialObj: undefined,
      };

      // ACT
      const result = getEditableLoadAtAttributes(resourceState);

      // ASSERT
      expect(result).toEqual([LoadedAtAttributes.LOADED_IN_GROW_AT]);
    });
  });
});
