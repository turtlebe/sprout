import { DialogScheduleDefinitionPicker } from '@plentyag/brand-ui/src/components';
import { mockScheduleDefinitions, mockSchedules } from '@plentyag/core/src/test-helpers/mocks/environment';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsScheduleItem, ScheduleItem } from '.';

jest.mock('@plentyag/brand-ui/src/components/dialog-schedule-definition-picker');

const onChange = jest.fn();
const onDelete = jest.fn();
const [scheduleDefinition] = mockScheduleDefinitions;
const [schedule] = mockSchedules;
const MockDialogScheduleDefinitionPicker = DialogScheduleDefinitionPicker as jest.Mock;
const dataTestIds = {
  ...dataTestIdsScheduleItem,
  dialogScheduleDefinitionPickerSubmit: 'dialogScheduleDefinitionPickerSubmit',
};
const newPath = 'sites/TEST/scheduleDefinitons/SetTemperature';

interface RenderScheduleItem {
  scheduleOrDefinition: ScheduleItem['scheduleOrDefinition'];
  disabled?: ScheduleItem['disabled'];
}

function renderScheduleItem({ scheduleOrDefinition, disabled }: RenderScheduleItem) {
  return render(
    <MemoryRouter>
      <ScheduleItem
        templateScheduleDefinition={scheduleDefinition}
        scheduleOrDefinition={scheduleOrDefinition}
        disabled={disabled}
        onChange={onChange}
        onDelete={onDelete}
      />
    </MemoryRouter>
  );
}

describe('ScheduleItem', () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    MockDialogScheduleDefinitionPicker.mockImplementation(({ onChange, initialValue }) => (
      <button
        data-testid={dataTestIds.dialogScheduleDefinitionPickerSubmit}
        onClick={() => onChange({ ...initialValue, path: newPath })}
      />
    ));
  });

  it('renders nothing', () => {
    const { container } = renderScheduleItem({ scheduleOrDefinition: null });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders an item for an existing Schedule', () => {
    const { queryByTestId } = renderScheduleItem({ scheduleOrDefinition: schedule });

    expect(queryByTestId(dataTestIds.schedule)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.scheduleDefinition)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.status)).toHaveTextContent('OVERRIDE');
    expect(queryByTestId(dataTestIds.dropdown)).not.toBeDisabled();
  });

  it('renders an item for a new Schedule', () => {
    const { queryByTestId } = renderScheduleItem({ scheduleOrDefinition: scheduleDefinition });

    expect(queryByTestId(dataTestIds.schedule)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.scheduleDefinition)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.status)).toHaveTextContent('NEW');
    expect(queryByTestId(dataTestIds.dropdown)).not.toBeDisabled();
  });

  it('renders with a disabled state', () => {
    const { queryByTestId } = renderScheduleItem({ scheduleOrDefinition: scheduleDefinition, disabled: true });

    expect(queryByTestId(dataTestIds.dropdown)).toBeDisabled();
  });

  it('calls `onDelete` when deleting the item', () => {
    const { queryByTestId } = renderScheduleItem({ scheduleOrDefinition: schedule });

    expect(onDelete).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.dropdown).click();
    queryByTestId(dataTestIds.delete).click();

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(schedule);
  });

  it('calls `onChange` when updating item', () => {
    const { queryByTestId } = renderScheduleItem({ scheduleOrDefinition: schedule });

    expect(onChange).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.dropdown).click();
    queryByTestId(dataTestIds.edit).click();
    queryByTestId(dataTestIds.dialogScheduleDefinitionPickerSubmit).click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ ...schedule, path: newPath });
  });
});
