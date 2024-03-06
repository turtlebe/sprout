import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mockUploadHistory } from '../../test-helpers/mock-upload-history';

import { dataTestIdsImportedPlansTable as dataTestIds, ImportedPlansTable } from '.';

describe('ImportedPlansTable', () => {
  function renderImportedPlansTable(isLoading) {
    return render(<ImportedPlansTable uploadHistory={mockUploadHistory} isLoading={isLoading} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });
  }

  it('renders table when there is data and not loading', () => {
    // ACT
    const { queryByTestId, container } = renderImportedPlansTable(false);

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(container.querySelector('.ag-root-wrapper')).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
  });

  it('shows loading when isLoading is passed as true', () => {
    // ACT
    const { queryByTestId, container } = renderImportedPlansTable(true);

    // ASSERT
    expect(container.querySelector('.ag-root-wrapper')).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
  });
});
