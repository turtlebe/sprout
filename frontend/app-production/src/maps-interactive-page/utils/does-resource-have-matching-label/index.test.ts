import { mocksResourcesState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';

import { doesResourceHaveMatchingLabel } from '.';

const mocksResourcesStateWithLabels = {
  ...mocksResourcesState[0],
  containerLabels: ['test_container_label'],
  materialLabels: ['test_material_label'],
};

describe('doesResourceHaveMatchingLabel', () => {
  it('returns true if labels is falsely or empty array', () => {
    expect(doesResourceHaveMatchingLabel(mocksResourcesStateWithLabels, undefined)).toBe(true);
    expect(doesResourceHaveMatchingLabel(mocksResourcesStateWithLabels, null)).toBe(true);
    expect(doesResourceHaveMatchingLabel(mocksResourcesStateWithLabels, [])).toBe(true);
  });

  it('returns true if resource contains matching container label', () => {
    expect(doesResourceHaveMatchingLabel(mocksResourcesStateWithLabels, ['test_container_label'])).toBe(true);
  });

  it('returns true if resource contains matching material label', () => {
    expect(doesResourceHaveMatchingLabel(mocksResourcesStateWithLabels, ['test_material_label'])).toBe(true);
  });

  it('returns true when contains both container and material label', () => {
    expect(
      doesResourceHaveMatchingLabel(mocksResourcesStateWithLabels, ['test_container_label', 'test_material_label'])
    ).toBe(true);
  });

  it('returns false if label is not found', () => {
    expect(doesResourceHaveMatchingLabel(mocksResourcesStateWithLabels, ['label_that_does_not_exist'])).toBe(false);
  });
});
