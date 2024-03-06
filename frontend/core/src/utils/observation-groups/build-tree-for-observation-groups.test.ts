import { buildTreeForObservationGroups } from './build-tree-for-observation-groups';
import { observationGroups } from './test-mocks';

describe('buildTreeForObservationGroups', () => {
  it('returns an tree object with a path, measurementType, observationName hierarchy and a count at each level', () => {
    const observationGroupsByCount = buildTreeForObservationGroups(observationGroups);

    expect(observationGroupsByCount).toEqual({
      count: 0,
      children: {
        p1: {
          count: 10,
          children: {
            m1: {
              count: 3,
              children: {
                o1: { count: 1, lastObservedAt: '2022-01-01T00:00:00Z', children: {} },
                o2: { count: 2, lastObservedAt: '2022-01-01T01:00:00Z', children: {} },
              },
            },
            m2: {
              count: 3,
              children: {
                o3: { count: 3, lastObservedAt: '2022-01-01T02:00:00Z', children: {} },
              },
            },
            m3: {
              count: 4,
              children: {
                o4: { count: 4, lastObservedAt: '2022-01-01T03:00:00Z', children: {} },
              },
            },
          },
        },
        p2: {
          count: 10,
          children: {
            m4: {
              count: 6,
              children: {
                o5: { count: 1, lastObservedAt: '2022-01-01T04:00:00Z', children: {} },
                o6: { count: 2, lastObservedAt: '2022-01-01T05:00:00Z', children: {} },
                o7: { count: 3, lastObservedAt: '2022-01-01T06:00:00Z', children: {} },
              },
            },
            m5: {
              count: 4,
              children: {
                o8: { count: 4, lastObservedAt: '2022-01-01T07:00:00Z', children: {} },
              },
            },
          },
        },
      },
    });
  });
});
