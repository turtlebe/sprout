import { mockPackagingLot, mockPackagingLotWithOverride } from '@plentyag/core/src/test-helpers/mocks';

import { getTestStatusNotes } from '.';

describe('getTestStatusNotes', () => {
  it('returns override notes found in lot', () => {
    // ACT
    const result = getTestStatusNotes(mockPackagingLotWithOverride);

    // ASSERT
    expect(result).toEqual(
      'QA: Testing QA long string in the notes section to see how is the behavior in the UI in toggle view. LT: Testing lab test long string in the notes section to see how is the behavior in the UI in toggle view'
    );
  });

  it('returns empty is no notes found', () => {
    // ACT
    const result = getTestStatusNotes(mockPackagingLot);

    // ASSERT
    expect(result).toEqual('');
  });
});
