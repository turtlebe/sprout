import { render } from '@testing-library/react';
import React from 'react';

import { mockUploadError } from '../../test-helpers/mock-upload-error';

import { dataTestIdsUploadWorksheetErrorMessage as dataTestIds, UploadWorksheetErrorMessage } from '.';

describe('UploadWorksheetErrorMessage', () => {
  it('renders', () => {
    const { queryByTestId } = render(<UploadWorksheetErrorMessage errorData={mockUploadError} />);

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.workcenterError('PropLoad'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.workcenterError('PropLoad')).textContent).toContain('for plan date 2042-07-22');
    expect(queryByTestId(dataTestIds.workcenterError('PropLoad')).textContent).toContain(
      'table_serial is not valid, given P800-0008046A:5WNV-JSM6-KB'
    );
  });
});
