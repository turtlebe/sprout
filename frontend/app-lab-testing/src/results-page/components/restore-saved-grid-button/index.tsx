import { Button } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const dataTestIds = {
  button: 'button',
};

/**
 * Button that removes any existing query parameters which will
 * cause the saved grid state to be restored. When the query
 * parameter "lab_test_sample_id" is present the saved grid filter
 * state is overriden by a filter state showing only the sample id
 * given in the query parameter.
 */
export const RestoreSavedGridButton: React.FC = () => {
  const history = useHistory();

  const handleRemoveQueryParameter = () => {
    history.replace({
      search: '',
    });
  };

  return (
    <Button data-testid={dataTestIds.button} variant={'contained'} onClick={handleRemoveQueryParameter}>
      Restore Saved Grid
    </Button>
  );
};
