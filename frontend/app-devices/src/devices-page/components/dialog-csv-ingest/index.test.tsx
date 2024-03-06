import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsDialogCsvIngest as dataTestIds, DialogCsvIngest } from '.';

describe('DialogCsvIngest', () => {
  it('renders', () => {
    const { queryByTestId } = render(<DialogCsvIngest open={true} onClose={jest.fn()} onSuccess={jest.fn()} />, {
      wrapper: props => <MemoryRouter {...props} />,
    });

    expect(queryByTestId(dataTestIds.title)).toHaveTextContent('CSV/JSON Ingest');
  });
});
