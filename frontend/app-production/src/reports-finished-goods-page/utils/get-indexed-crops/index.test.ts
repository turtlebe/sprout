import { mockCrop, mockCropB10 } from '../../test-helpers/mock-crops';

import { getIndexedCrops } from '.';

describe('getIndexedCrops', () => {
  it('returns crops record indexed by crop name', () => {
    // ACT
    const result = getIndexedCrops([mockCrop, mockCropB10]);

    // ASSERT
    expect(result).toEqual({
      C11: mockCrop,
      B10: mockCropB10,
    });
  });
});
