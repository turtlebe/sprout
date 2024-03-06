import { render } from '@testing-library/react';
import React from 'react';

import { AgGridContainerLocationRenderer, dataTestIdsAgGridContainerLocationRenderer as dataTestIds } from '.';

const containerLocation = 'mock-container-location-name';

describe('AgGridContainerLocationRenderer', () => {
  it('shows the container loctation name', () => {
    const { queryByTestId } = render(
      <AgGridContainerLocationRenderer containerLocation={containerLocation} hasConflicts={false} />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(containerLocation);
    expect(queryByTestId(dataTestIds.conflictIcon)).not.toBeInTheDocument();
  });

  it('shows icon when there are conflicts', () => {
    const { queryByTestId } = render(
      <AgGridContainerLocationRenderer containerLocation={containerLocation} hasConflicts={true} />
    );

    expect(queryByTestId(dataTestIds.conflictIcon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(containerLocation);
  });
});
