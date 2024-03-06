import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIds, MAX_OPERATIONS_TO_SHOW, OperationTooltip } from '.';

const op1: ProdResources.Operation = {
  id: '1',
  type: 'Add Label',
  username: 'test user',
  endDt: '2020-12-10T18:13:57.000Z',
  startDt: '2020-12-10T18:13:57.000Z',
  machine: null,
  stateIn: null,
  stateOut: null,
  materialsConsumed: null,
  materialsCreated: null,
};

const op2: ProdResources.Operation = {
  id: '2',
  type: 'Remove Label',
  username: 'test user',
  endDt: '2020-12-10T18:14:57.000Z',
  startDt: '2020-12-10T18:14:57.000Z',
  machine: null,
  stateIn: null,
  stateOut: null,
  materialsConsumed: null,
  materialsCreated: null,
};

describe('OperationTooltip', () => {
  it('shows header when more than one operation provided', () => {
    const operations = [op1, op2];
    const { queryByTestId } = render(<OperationTooltip operations={operations} />);
    expect(queryByTestId(dataTestIds.header)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.footer)).not.toBeInTheDocument();
  });

  it('shows no header with single operation', () => {
    const operations = [op1];
    const { queryByTestId } = render(<OperationTooltip operations={operations} />);
    expect(queryByTestId(dataTestIds.header)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.footer)).not.toBeInTheDocument();
  });

  it('shows footer when max operations provided', () => {
    const maxPlusOne: number = MAX_OPERATIONS_TO_SHOW + 1;
    const operations = new Array<ProdResources.Operation>(maxPlusOne);
    operations.fill(op1);
    const { queryByTestId } = render(<OperationTooltip operations={operations} />);
    expect(queryByTestId(dataTestIds.footer)).toBeInTheDocument();
  });

  it('body shows item for each operations up to maximum', () => {
    const operations = [op1, op2];
    const { queryAllByTestId } = render(<OperationTooltip operations={operations} />);
    expect(queryAllByTestId(dataTestIds.bodyItem)).toHaveLength(operations.length);
  });
});
