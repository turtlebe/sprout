import { mockScheduleDefinitions } from '@plentyag/app-environment/src/common/test-helpers';
import { DialogScheduleDefinitionPicker } from '@plentyag/brand-ui/src/components';
import { render } from '@testing-library/react';
import React from 'react';

import { ButtonScheduleDefinitionPicker, dataTestIdsButtonScheduleDefinitionPicker as dataTestIds } from '.';

jest.mock('@plentyag/brand-ui/src/components/dialog-schedule-definition-picker');
const MockDialogScheduleDefinitionPicker = DialogScheduleDefinitionPicker as jest.Mock;

const onChange = jest.fn();

const [scheduleDefinition] = mockScheduleDefinitions;

describe('ButtonScheduleDefinitionPicker', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    MockDialogScheduleDefinitionPicker.mockImplementation(({ onChange }) => (
      <div data-testid="dialog" onClick={onChange} />
    ));
  });

  it('opens DialogScheduleDefinitionPicker when clicking the CTA.', () => {
    const { queryByTestId } = render(
      <ButtonScheduleDefinitionPicker scheduleDefinition={scheduleDefinition} onChange={onChange} />
    );

    expect(MockDialogScheduleDefinitionPicker).toHaveBeenLastCalledWith(expect.objectContaining({ open: false }), {});

    expect(queryByTestId(dataTestIds.root)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Add Schedule');
    queryByTestId(dataTestIds.root).click();

    expect(MockDialogScheduleDefinitionPicker).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }), {});
    expect(onChange).toHaveBeenCalledTimes(0);

    queryByTestId('dialog').click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(MockDialogScheduleDefinitionPicker).toHaveBeenLastCalledWith(expect.objectContaining({ open: false }), {});
  });

  it('renders with a disabled CTA.', () => {
    const { queryByTestId } = render(
      <ButtonScheduleDefinitionPicker scheduleDefinition={scheduleDefinition} onChange={onChange} disabled />
    );

    expect(queryByTestId(dataTestIds.root)).toBeDisabled();
  });
});
