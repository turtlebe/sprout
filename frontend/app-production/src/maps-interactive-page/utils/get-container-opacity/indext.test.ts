import { cloneDeep } from 'lodash';

import { mockMapStateForTable } from '../../test-helpers/mock-map-state-data';

import { FADED_OPACITY, getContainerOpacity, SOLID_OPACITY } from '.';

describe('getContainerOpacity', () => {
  describe('with selected age cohort date', () => {
    let ageCohortDate;

    beforeEach(() => {
      ageCohortDate = new Date('2022-06-05T00:00:05');
    });

    it('returns faded opacity for empty container', () => {
      // ARRANGE
      const resource = {};

      // ACT
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: [],
      });

      // ASSERT
      expect(result).toEqual(FADED_OPACITY);
    });

    it('returns faded opacity for container with load date not in selected cohort', () => {
      // ARRANGE
      const [resource] = Object.values(mockMapStateForTable);

      // ACT
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: [],
      });

      // ASSERT
      expect(result).toEqual(FADED_OPACITY);
    });

    it('returns solid opacity for container with load date not in selected cohort', () => {
      // ARRANGE
      const [resource] = Object.values(mockMapStateForTable) as any;
      const resourceLoadedAt = resource.resourceState.materialAttributes.loadedInGermAt;

      // ACT
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: new Date(resourceLoadedAt),
        selectedCrops: [],
        selectedLabels: [],
      });

      // ASSERT
      expect(result).toEqual(SOLID_OPACITY);
    });
  });

  describe('without cohort date (selected "show all")', () => {
    let ageCohortDate;

    beforeEach(() => {
      ageCohortDate = 'all';
    });

    it('returns solid opacity for empty container', () => {
      // ARRANGE
      const resource = {};

      // ACT
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: [],
      });

      // ASSERT
      expect(result).toEqual(SOLID_OPACITY);
    });

    it('returns solid opacity for container with load date not in selected cohort', () => {
      // ARRANGE
      const [resource] = Object.values(mockMapStateForTable);

      // ACT
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: [],
      });

      // ASSERT
      expect(result).toEqual(SOLID_OPACITY);
    });

    it('returns solid opacity for container with load date not in selected cohort', () => {
      // ARRANGE
      const [resource] = Object.values(mockMapStateForTable);
      const resourceLoadedAt = new Date(resource.resourceState.materialAttributes.loadedInGermAt);

      // ACT
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: resourceLoadedAt,
        selectedCrops: [],
        selectedLabels: [],
      });

      // ASSERT
      expect(result).toEqual(SOLID_OPACITY);
    });

    it('returns solid opacity for null selected cohort', () => {
      // ARRANGE
      ageCohortDate = null;
      const [resource] = Object.values(mockMapStateForTable);

      // ACT
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: [],
      });

      // ASSERT
      expect(result).toEqual(SOLID_OPACITY);
    });
  });

  describe('with selected crops', () => {
    const ageCohortDate = 'all';
    const [resource] = Object.values(mockMapStateForTable);

    it('returns faded opacity when the resources not does not contain crops matching the given selected crops', () => {
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: ['SAS'],
        selectedLabels: [],
      });

      expect(result).toEqual(FADED_OPACITY);
    });

    it('returns solid opacity when the resource contains crops matching the given selected crops', () => {
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: ['WHC'],
        selectedLabels: [],
      });

      expect(result).toEqual(SOLID_OPACITY);
    });

    it('returns solid opacity when selected crops is empty', () => {
      const result = getContainerOpacity({
        resource,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: [],
      });

      expect(result).toEqual(SOLID_OPACITY);
    });
  });

  describe('with selected labels', () => {
    const ageCohortDate = 'all';
    const [resource] = Object.values(mockMapStateForTable);
    const resourceWithLabels = cloneDeep(resource);
    resourceWithLabels.resourceState.containerLabels = ['broken_tower'];

    it('returns faded opacity when the resources not does not contain label matching the given selected labels', () => {
      const result = getContainerOpacity({
        resource: resourceWithLabels,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: ['test_label'],
      });

      expect(result).toEqual(FADED_OPACITY);
    });

    it('returns solid opacity when the resource contains label matching the given selected label', () => {
      const result = getContainerOpacity({
        resource: resourceWithLabels,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: ['broken_tower'],
      });

      expect(result).toEqual(SOLID_OPACITY);
    });

    it('returns solid opacity when selected labels is empty', () => {
      const result = getContainerOpacity({
        resource: resourceWithLabels,
        selectedAgeCohortDate: ageCohortDate,
        selectedCrops: [],
        selectedLabels: [],
      });

      expect(result).toEqual(SOLID_OPACITY);
    });
  });
});
