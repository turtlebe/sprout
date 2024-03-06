import { DialogSchedulePicker } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonSchedulePicker, dataTestIdsButtonSchedulePicker as dataTestIds } from '.';

jest.mock('@plentyag/brand-ui/src/components/dialog-schedule-picker');
const MockDialogSchedulePicker = DialogSchedulePicker as jest.Mock;

const onChange = jest.fn();

describe('ButtonSchedulePicker', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    MockDialogSchedulePicker.mockImplementation(({ onChange }) => <div data-testid="dialog" onClick={onChange} />);
  });

  it('opens DialogSchedulePicker when clicking the CTA.', () => {
    const { queryByTestId } = render(<ButtonSchedulePicker onChange={onChange} />);

    expect(MockDialogSchedulePicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: false, chooseActionDefinitionKey: undefined, multiple: undefined }),
      {}
    );

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Add Schedule');
    queryByTestId(dataTestIds.root).click();

    expect(MockDialogSchedulePicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: true, chooseActionDefinitionKey: undefined, multiple: undefined }),
      {}
    );
    expect(onChange).toHaveBeenCalledTimes(0);

    queryByTestId('dialog').click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(MockDialogSchedulePicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: false, chooseActionDefinitionKey: undefined, multiple: undefined }),
      {}
    );
  });

  it('calls DialogSchedulePicker with chooseActionDefinitionKey', () => {
    render(<ButtonSchedulePicker onChange={onChange} chooseActionDefinitionKey />);

    expect(MockDialogSchedulePicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: false, chooseActionDefinitionKey: true, multiple: undefined }),
      {}
    );
  });

  it('calls DialogSchedulePicker with chooseActionDefinitionKey', () => {
    render(<ButtonSchedulePicker onChange={onChange} multiple />);

    expect(MockDialogSchedulePicker).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: false, chooseActionDefinitionKey: undefined, multiple: true }),
      {}
    );
  });

  it('renders with a disabled state', () => {
    const { queryByTestId } = render(<ButtonSchedulePicker onChange={onChange} disabled />);

    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
  });
});
