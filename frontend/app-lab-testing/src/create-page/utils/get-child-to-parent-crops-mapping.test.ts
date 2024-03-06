import { mockCrops } from '../../common/test-helpers/mock-crops-skus';

import { getChildToParentCropsMapping } from './get-child-to-parent-crops-mapping';

describe('getChildToParentCropsMapping()', () => {
  it('will throw exception if bad argument passed', () => {
    expect(() => getChildToParentCropsMapping(undefined)).toThrow();
  });

  it('will return no mappings, if no crops passed', () => {
    const childToParentCropsMapping = getChildToParentCropsMapping([]);
    expect(childToParentCropsMapping.size).toBe(0);
  });

  it('will return mapping since there are child crops mapping exist', () => {
    const childToParentCropsMapping = getChildToParentCropsMapping(mockCrops);
    expect(childToParentCropsMapping).toEqual(
      new Map([
        ['GRC', ['SPT']],
        ['MSX', ['SPT', 'SMB']],
        ['CRC', ['SMB']],
      ])
    );
  });
});
