import { buildSchedule, mockScheduleDefinitions } from '@plentyag/app-environment/src/common/test-helpers';
import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsDialogBulkApplySchedules, DialogBulkApplySchedules } from '.';

import { ButtonScheduleDefinitionPicker } from './components';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock(
  '@plentyag/app-environment/src/schedule-page/components/dialog-bulk-apply-schedules/components/button-schedule-definition-picker'
);

const MockButtonScheduleDefinitionPicker = ButtonScheduleDefinitionPicker as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const makeRequest = jest.fn();
const onSuccess = jest.fn();
const onClose = jest.fn();
const schedule = buildSchedule({ path: 'sites/LAR1/scheduleDefinitions/SetTemperature' });
const otherSchedule = buildSchedule({ path: 'sites/LAX1/scheduleDefinitions/SetTemperature' });
const otherScheduleDefinition = mockScheduleDefinitions[1];
const [scheduleDefinition] = mockScheduleDefinitions;
const dataTestIds = {
  ...dataTestIdsDialogBulkApplySchedules,
  addSchedule: 'addSchedule',
  addScheduleDefinition: 'addScheduleDefinition',
};

function getJSX() {
  return (
    <MemoryRouter>
      <DialogBulkApplySchedules
        open
        onSuccess={onSuccess}
        onClose={onClose}
        schedule={schedule}
        scheduleDefinition={scheduleDefinition}
      />
    </MemoryRouter>
  );
}

function renderDialogBulkApplySchedules() {
  return render(getJSX());
}

describe('DialogBulkApplySchedules', () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    mockCurrentUser();
    mockGlobalSnackbar();
    MockButtonScheduleDefinitionPicker.mockImplementation(({ onChange, disabled }) => (
      <div>
        <button data-testid={dataTestIds.addSchedule} disabled={disabled} onClick={() => onChange(otherSchedule)} />
        <button
          data-testid={dataTestIds.addScheduleDefinition}
          disabled={disabled}
          onClick={() => onChange(otherScheduleDefinition)}
        />
      </div>
    ));
    makeRequest.mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });
  });

  it('bulk applies one schedule to others', () => {
    const { queryByTestId } = renderDialogBulkApplySchedules();

    expect(queryByTestId(dataTestIds.noSchedulePlaceholder)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.save)).toBeDisabled();
    expect(queryByTestId(dataTestIds.scheduleItem(otherSchedule).root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.scheduleItem(otherScheduleDefinition).root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.addSchedule).click();

    expect(queryByTestId(dataTestIds.noSchedulePlaceholder)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.save)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.scheduleItem(otherSchedule).root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.scheduleItem(otherScheduleDefinition).root)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.addScheduleDefinition).click();

    expect(queryByTestId(dataTestIds.scheduleItem(otherScheduleDefinition).root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.scheduleItem(otherSchedule).dropdown)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.scheduleItem(otherScheduleDefinition).dropdown)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.confirmation.root)).not.toBeInTheDocument();

    expect(makeRequest).toHaveBeenCalledTimes(0);

    queryByTestId(dataTestIds.save).click();

    expect(queryByTestId(dataTestIds.confirmation.root)).toBeInTheDocument();

    queryByTestId(dataTestIds.confirmation.confirm).click();

    expect(makeRequest).toHaveBeenCalledTimes(1);
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          templateScheduleId: schedule.id,
          otherScheduleIds: [otherSchedule.id],
          otherSchedulePaths: [otherScheduleDefinition.path],
          updatedBy: 'olittle',
        },
      })
    );
    expect(queryByTestId(dataTestIds.scheduleItem(otherSchedule).root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.scheduleItem(otherScheduleDefinition).root)).not.toBeInTheDocument();
  });

  it('locks all CTA during loading', () => {
    mockUsePostRequest.mockRestore();
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { queryByTestId, rerender } = renderDialogBulkApplySchedules();

    queryByTestId(dataTestIds.addSchedule).click();
    queryByTestId(dataTestIds.addScheduleDefinition).click();

    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: true });

    rerender(getJSX());

    expect(queryByTestId(dataTestIds.save)).toBeDisabled();
    expect(queryByTestId(dataTestIds.addSchedule)).toBeDisabled();
    expect(queryByTestId(dataTestIds.addScheduleDefinition)).toBeDisabled();
    expect(queryByTestId(dataTestIds.scheduleItem(otherSchedule).dropdown)).toBeDisabled();
    expect(queryByTestId(dataTestIds.scheduleItem(otherScheduleDefinition).dropdown)).toBeDisabled();
  });
});
