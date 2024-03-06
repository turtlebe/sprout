import { dataTestIdsSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { render } from '@testing-library/react';
import React from 'react';

import { GlobalSnackbar, GlobalSnackbarContext } from '.';

describe('GlobalSnackbar', () => {
  it('a global snackbar', () => {
    const { queryByTestId } = render(
      <GlobalSnackbar>
        <GlobalSnackbarContext.Consumer>
          {snackbar => (
            <button data-testid="button" onClick={() => snackbar.successSnackbar('success')}>
              Notify
            </button>
          )}
        </GlobalSnackbarContext.Consumer>
      </GlobalSnackbar>
    );

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).not.toBeInTheDocument();

    queryByTestId('button').click();

    expect(queryByTestId(dataTestIdsSnackbar.snackbar)).toBeInTheDocument();
  });
});
