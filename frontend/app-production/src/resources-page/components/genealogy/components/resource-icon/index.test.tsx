import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIds, hasIcon, ResourceIcon } from '.';

describe('ResourceIcon', () => {
  it('renders nothing if resourceType is not present in mapping', () => {
    const { queryByTestId } = render(<ResourceIcon width={10} height={1} resourceType="LOADED_TRAY" />);
    expect(queryByTestId(dataTestIds.icon)).toBe(null);
  });

  it('renders icon for resourceType "TOWER"', () => {
    const { queryByTestId } = render(<ResourceIcon width={10} height={1} resourceType="TOWER" />);
    expect(queryByTestId(dataTestIds.icon)).toBeTruthy();
  });
});

describe('hasIcon', () => {
  it('has icon with resourceType "TOWER, TRAY, TABLE, SEED and MEDIA"', () => {
    expect(hasIcon('TOWER')).toBe(true);
    expect(hasIcon('TRAY')).toBe(true);
    expect(hasIcon('TABLE')).toBe(true);
    expect(hasIcon('SEED')).toBe(true);
    expect(hasIcon('MEDIA')).toBe(true);
  });

  it('does not have icon with resourceType "LOADED_TRAY"', () => {
    expect(hasIcon('LOADED_TRAY')).toBe(false);
  });
});
