import { mockWorkbinInstanceData } from '../../test-helpers';

import { getFilteredWorkbinTaskInstance } from '.';

describe('getFilteredWorkbinTaskInstance', () => {
  it('returns false when emtpy task provided', () => {
    expect(getFilteredWorkbinTaskInstance(null, 'TestTitle')).toBe(false);
  });

  it('returns true when task provided with empty search text provided', () => {
    expect(getFilteredWorkbinTaskInstance(mockWorkbinInstanceData[0].workbinTaskInstance, '')).toBe(true);
  });

  it('returns true when task provided with an existing search text provided', () => {
    expect(getFilteredWorkbinTaskInstance(mockWorkbinInstanceData[0].workbinTaskInstance, 'test-description')).toBe(
      true
    );
  });

  it('returns false when task provided with non existing search text provided', () => {
    expect(
      getFilteredWorkbinTaskInstance(mockWorkbinInstanceData[0].workbinTaskInstance, 'non-existing-description')
    ).toBe(false);
  });

  it('returns true when task provided with an existing search of partial "id" provided', () => {
    expect(getFilteredWorkbinTaskInstance(mockWorkbinInstanceData[0].workbinTaskInstance, '444b0e9e')).toBe(true);
  });

  it('returns false when task provided with an non-existing search of "id" provided', () => {
    expect(getFilteredWorkbinTaskInstance(mockWorkbinInstanceData[0].workbinTaskInstance, '1234-nope')).toBe(false);
  });

  it('returns false when task provided with non existing search text provided', () => {
    expect(
      getFilteredWorkbinTaskInstance(mockWorkbinInstanceData[0].workbinTaskInstance, 'non-existing-description')
    ).toBe(false);
  });

  it('returns true when task provided with an existing search text provided based on createdAt date', () => {
    expect(getFilteredWorkbinTaskInstance(mockWorkbinInstanceData[0].workbinTaskInstance, '08/04/2021', true)).toBe(
      true
    );
    expect(getFilteredWorkbinTaskInstance(mockWorkbinInstanceData[0].workbinTaskInstance, '08/04', true)).toBe(true);
  });
});
