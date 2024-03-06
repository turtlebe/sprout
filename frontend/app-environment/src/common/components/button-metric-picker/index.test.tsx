import { DialogMetricPicker } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonMetricPicker, dataTestIdsButtonMetricPicker as dataTestIds } from '.';

jest.mock('@plentyag/brand-ui/src/components/dialog-metric-picker');
const MockDialogMetricPicker = DialogMetricPicker as jest.Mock;

const onChange = jest.fn();
const renderAlertRule = jest.fn();

describe('ButtonMetricPicker', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    MockDialogMetricPicker.mockImplementation(({ onChange }) => <div data-testid="dialog" onClick={onChange} />);
  });

  it('opens DialogMetricPicker when clicking the CTA.', () => {
    const { queryByTestId } = render(<ButtonMetricPicker onChange={onChange} />);

    expect(MockDialogMetricPicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: false, renderAlertRule: undefined }),
      {}
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Add Metric');
    queryByTestId(dataTestIds.root).click();

    expect(MockDialogMetricPicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: true, renderAlertRule: undefined }),
      {}
    );
    expect(onChange).toHaveBeenCalledTimes(0);

    queryByTestId('dialog').click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(MockDialogMetricPicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: false, renderAlertRule: undefined }),
      {}
    );
  });

  it('calls DialogMetricPicker with renderAlertRule', () => {
    render(<ButtonMetricPicker onChange={onChange} renderAlertRule={renderAlertRule} />);

    expect(MockDialogMetricPicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: false, renderAlertRule }),
      {}
    );
  });

  it('calls DialogMetricPicker with renderAlertRule', () => {
    render(<ButtonMetricPicker onChange={onChange} renderAlertRule={renderAlertRule} />);

    expect(MockDialogMetricPicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: false, renderAlertRule }),
      {}
    );
  });

  it('renders with a disabled state', () => {
    const { queryByTestId } = render(<ButtonMetricPicker onChange={onChange} disabled />);

    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
  });
});
