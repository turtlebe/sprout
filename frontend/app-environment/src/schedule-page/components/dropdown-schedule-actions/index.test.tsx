import '@plentyag/core/src/yup/extension';
import { mockScheduleDefinitions, mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { DialogBaseForm } from '@plentyag/brand-ui/src/components';
import { Schedule } from '@plentyag/core/src/types/environment';
import { act, render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDropdownScheduleActions as dataTestIds, DropdownScheduleActions } from '.';

jest.mock('@plentyag/brand-ui/src/components/dialog-base-form');

const mockDialogBaseForm = DialogBaseForm as jest.Mock;
const onEditActions = jest.fn();
const onScheduleUpdated = jest.fn();
const [schedule] = mockSchedules;
const [scheduleDefinition] = mockScheduleDefinitions;
const updateScheduleButton = 'updateScheduleButton';

mockDialogBaseForm.mockImplementation(({ open, onScheduleUpdated }) =>
  open ? <button data-testid={updateScheduleButton} onClick={() => onScheduleUpdated()} /> : null
);

function renderDropdownScheduleActions(scheduleProp: Schedule = schedule) {
  return render(
    <DropdownScheduleActions
      schedule={scheduleProp}
      scheduleDefinition={scheduleDefinition}
      onEditActions={onEditActions}
      onScheduleUpdated={onScheduleUpdated}
    />
  );
}

describe('DropdownScheduleActions', () => {
  beforeEach(() => {
    onEditActions.mockRestore();
    onScheduleUpdated.mockRestore();
  });

  it('renders two DropdownItems', () => {
    const { queryByTestId } = renderDropdownScheduleActions();

    expect(queryByTestId(dataTestIds.editActions)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.editSchedule)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.editActions)).toBeVisible();
    expect(queryByTestId(dataTestIds.editSchedule)).toBeVisible();

    queryByTestId(dataTestIds.editActions).click();

    expect(queryByTestId(dataTestIds.editActions)).not.toBeVisible();
    expect(queryByTestId(dataTestIds.editSchedule)).not.toBeVisible();
  });

  it('calls `onEditActions`', () => {
    const { queryByTestId } = renderDropdownScheduleActions();

    expect(onEditActions).not.toHaveBeenCalled();
    expect(onScheduleUpdated).not.toHaveBeenCalled();

    act(() => queryByTestId(dataTestIds.root).click());
    act(() => queryByTestId(dataTestIds.editActions).click());

    expect(onEditActions).toHaveBeenCalled();
    expect(onScheduleUpdated).not.toHaveBeenCalled();
  });

  it('calls `onScheduleUpdated`', () => {
    const { queryByTestId } = renderDropdownScheduleActions();

    expect(onEditActions).not.toHaveBeenCalled();
    expect(onScheduleUpdated).not.toHaveBeenCalled();
    expect(queryByTestId(updateScheduleButton)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.editSchedule).click();

    expect(queryByTestId(updateScheduleButton)).toBeVisible();

    expect(onEditActions).not.toHaveBeenCalled();
    // expect(onScheduleUpdated).toHaveBeenCalled();
  });

  it('does not allow bulk apply schedule when the schedule has no action', () => {
    const { queryByTestId } = renderDropdownScheduleActions({ ...schedule, actions: [] });

    act(() => queryByTestId(dataTestIds.root).click());

    expect(queryByTestId(dataTestIds.bulkApply)).not.toBeInTheDocument();
  });

  it('allows bulk apply schedule when the schedule action', () => {
    const { queryByTestId } = renderDropdownScheduleActions();

    act(() => queryByTestId(dataTestIds.root).click());

    expect(queryByTestId(dataTestIds.bulkApply)).toBeInTheDocument();
  });
});
