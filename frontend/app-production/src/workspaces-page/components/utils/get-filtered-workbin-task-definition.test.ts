import { mockWorkbinTaskDefinitionData } from '../../test-helpers';

import { getFilteredWorkbinTaskDefinition } from '.';

describe('getFilteredWorkbinTaskDefinition', () => {
  it('returns false when emtpy task provided', () => {
    expect(getFilteredWorkbinTaskDefinition(null, 'TestTitle')).toBe(false);
  });

  it('returns true when task provided with empty search text provided', () => {
    expect(getFilteredWorkbinTaskDefinition(mockWorkbinTaskDefinitionData[0], '')).toBe(true);
  });

  it('returns true when task provided with an existing search text provided', () => {
    expect(getFilteredWorkbinTaskDefinition(mockWorkbinTaskDefinitionData[0], 'TestTitle')).toBe(true);
  });

  it('returns false when task provided with non existing search text provided', () => {
    expect(getFilteredWorkbinTaskDefinition(mockWorkbinTaskDefinitionData[0], 'NonExistingTitle')).toBe(false);
  });

  it('returns true when task provided with an existing search text provided based on createdAt date', () => {
    expect(getFilteredWorkbinTaskDefinition(mockWorkbinTaskDefinitionData[0], '08/03/2021', true)).toBe(true);
    expect(getFilteredWorkbinTaskDefinition(mockWorkbinTaskDefinitionData[0], '08/03', true)).toBe(true);
  });

  it('returns false when task provided with an non existing search text provided based on createdAt date', () => {
    expect(getFilteredWorkbinTaskDefinition(mockWorkbinTaskDefinitionData[0], '08/04/2021', true)).toBe(false);
  });

  it('returns false when task provided with an non existing search text with createdAt date but is set to false', () => {
    expect(getFilteredWorkbinTaskDefinition(mockWorkbinTaskDefinitionData[0], '08/04/2021', false)).toBe(false);
  });
});
