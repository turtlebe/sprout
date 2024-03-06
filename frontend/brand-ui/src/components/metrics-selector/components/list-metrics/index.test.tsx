import { Delete } from '@material-ui/icons';
import { render } from '@testing-library/react';
import React from 'react';

import { metrics } from '../../test-helpers/mocks';

import { dataTestIdsListMetrics as dataTestIds, ListMetrics } from '.';

const onClick = jest.fn();

describe('ListMetrics', () => {
  beforeEach(() => {
    onClick.mockRestore();
  });

  it('renders a list of metrics grouped by path', () => {
    const { queryByTestId } = render(<ListMetrics metrics={metrics} onClick={onClick} icon={Delete} />);

    expect(queryByTestId(dataTestIds.subheader('sites/SSF2'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.subheader('sites/LAX1'))).toBeInTheDocument();
    metrics.forEach(metric => {
      expect(queryByTestId(dataTestIds.item(metric))).toBeInTheDocument();
    });

    expect(onClick).not.toHaveBeenCalled();

    queryByTestId(dataTestIds.item(metrics[0])).click();

    expect(onClick).toHaveBeenCalledWith(metrics[0]);
  });
});
