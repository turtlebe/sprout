import { dataTestId } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { metrics } from '../../test-helpers/mocks';

import { dataTestIdsTransferList as dataTestIds, TransferList } from '.';

const onChange = jest.fn();

function getElement(container: HTMLElement, containerId: string, itemId: string): HTMLButtonElement {
  return container.querySelector<HTMLButtonElement>(`${dataTestId(containerId)} ${dataTestId(itemId)}`);
}

describe('TransferList', () => {
  beforeEach(() => {
    onChange.mockRestore();
  });

  it('allows to choose metrics', () => {
    const { container } = render(<TransferList options={metrics} selected={[]} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();

    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[0]))).toBeInTheDocument();
    expect(getElement(container, dataTestIds.selected, dataTestIds.item(metrics[0]))).not.toBeInTheDocument();

    getElement(container, dataTestIds.options, dataTestIds.item(metrics[0])).click();

    expect(onChange).toHaveBeenCalledWith([metrics[0]]);

    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[0]))).not.toBeInTheDocument();
    expect(getElement(container, dataTestIds.selected, dataTestIds.item(metrics[0]))).toBeInTheDocument();
  });

  it('allows to remove metrics', () => {
    const { container } = render(<TransferList options={[]} selected={metrics} onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();

    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[0]))).not.toBeInTheDocument();
    expect(getElement(container, dataTestIds.selected, dataTestIds.item(metrics[0]))).toBeInTheDocument();

    getElement(container, dataTestIds.selected, dataTestIds.item(metrics[0])).click();

    expect(onChange).toHaveBeenCalledWith([metrics[1], metrics[2]]);

    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[0]))).not.toBeInTheDocument();
    expect(getElement(container, dataTestIds.selected, dataTestIds.item(metrics[0]))).not.toBeInTheDocument();
  });

  it('filters selected metrics from the available ones', () => {
    const { container } = render(<TransferList options={metrics} selected={[metrics[0]]} onChange={onChange} />);

    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[0]))).not.toBeInTheDocument();
    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[1]))).toBeInTheDocument();
    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[2]))).toBeInTheDocument();
    expect(getElement(container, dataTestIds.selected, dataTestIds.item(metrics[0]))).toBeInTheDocument();
  });

  it('does not duplicate available metrics when removing a selected metric that already exist in the available ones', () => {
    const { container } = render(<TransferList options={metrics} selected={[metrics[0]]} onChange={onChange} />);

    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[0]))).not.toBeInTheDocument();

    getElement(container, dataTestIds.selected, dataTestIds.item(metrics[0])).click();

    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[0]))).toBeInTheDocument();
    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[1]))).toBeInTheDocument();
    expect(getElement(container, dataTestIds.options, dataTestIds.item(metrics[2]))).toBeInTheDocument();
    expect(getElement(container, dataTestIds.selected, dataTestIds.item(metrics[0]))).not.toBeInTheDocument();
  });
});
