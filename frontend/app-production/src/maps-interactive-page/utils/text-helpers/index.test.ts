import { cloneDeep } from 'lodash';

import { mocksResourcesState } from '../../test-helpers/mock-maps-state';

import { getTitleFromContainerData, getTitleFromResourceState, UNOCCUPIED_SLOT } from '.';

describe('textHelpers', () => {
  describe('getTitleFromResourceState', () => {
    it('returns the title with product', () => {
      // ARRANGE
      const resourceState = cloneDeep(mocksResourcesState[0]);

      // ACT
      const result = getTitleFromResourceState(resourceState);

      // ASSERT
      expect(result).toEqual('Table with BAC');
    });

    it('returns empty container title if material is not present', () => {
      // ARRANGE
      const resourceState = cloneDeep(mocksResourcesState[0]);
      resourceState.materialObj = null;

      // ACT
      const result = getTitleFromResourceState(resourceState);

      // ASSERT
      expect(result).toEqual('Empty table');
    });

    it('returns unoccupied title if material and container is not present', () => {
      // ARRANGE
      const resourceState = cloneDeep(mocksResourcesState[0]);
      resourceState.materialObj = null;
      resourceState.containerObj = null;

      // ACT
      const result = getTitleFromResourceState(resourceState);

      // ASSERT
      expect(result).toEqual(UNOCCUPIED_SLOT);
    });

    it('returns correct backup type if containerLocation object is given', () => {
      // ARRANGE
      const resourceState = cloneDeep(mocksResourcesState[0]);
      resourceState.materialObj = null;
      resourceState.containerObj.containerType = null;

      const containerLocation = {
        containerTypes: ['TABLE'],
      } as any;

      // ACT
      const result = getTitleFromResourceState(resourceState, containerLocation);

      // ASSERT
      expect(result).toEqual('Empty table');
    });

    it('returns uncontained material title if there is material but no container', () => {
      // ARRANGE
      const resourceState = cloneDeep(mocksResourcesState[0]);
      resourceState.containerObj = null;

      const containerLocation = {
        containerTypes: ['TABLE'],
      } as any;

      // ACT
      const result = getTitleFromResourceState(resourceState, containerLocation);

      // ASSERT
      expect(result).toEqual('Uncontained BAC');
    });

    it('draws ellipse if there are more than 2 crops', () => {
      // ARRANGE
      const resourceState = cloneDeep(mocksResourcesState[0]);
      resourceState.materialObj.product = 'BAC, SAS, WHC';

      // ACT
      const result = getTitleFromResourceState(resourceState);

      // ASSERT
      expect(result).toEqual('Table with BAC/SAS/...');
    });

    it('renders correct title with two crops', () => {
      // ARRANGE
      const resourceState = cloneDeep(mocksResourcesState[0]);
      resourceState.materialObj.product = 'BAC/SAS';

      // ACT
      const result = getTitleFromResourceState(resourceState);

      // ASSERT
      expect(result).toEqual('Table with BAC/SAS');
    });
  });

  describe('getTitleFromContainerData', () => {
    it('returns the title with product', () => {
      // ARRANGE
      const containerData = {
        resourceState: mocksResourcesState[0],
      };

      // ACT
      const result = getTitleFromContainerData(containerData);

      // ASSERT
      expect(result).toEqual('Table with BAC');
    });

    it('returns "Conflicting towers" if conflicts array is present', () => {
      // ARRANGE
      const containerData = {
        resourceState: null,
        containerLocation: {
          containerTypes: ['TOWER'],
        } as any,
        conflicts: [
          {
            resourceState: mocksResourcesState[0],
          },
          {
            resourceState: mocksResourcesState[1],
          },
        ],
      };

      // ACT
      const result = getTitleFromContainerData(containerData);

      // ASSERT
      expect(result).toEqual('Conflicting towers');
    });

    it('returns generic "Conflicting containers" if conflicts array is present and there is not containerTypes defined in containerLocation', () => {
      // ARRANGE
      const containerData = {
        resourceState: null,
        conflicts: [
          {
            resourceState: mocksResourcesState[0],
          },
          {
            resourceState: mocksResourcesState[1],
          },
        ],
      };

      // ACT
      const result = getTitleFromContainerData(containerData);

      // ASSERT
      expect(result).toEqual('Conflicting containers');
    });
  });
});
