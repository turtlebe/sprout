import '@plentyag/core/src/yup/extension';
import { mockSchedules } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  changeTextFieldDateTime,
  chooseFromSelectByIndex,
  getInputByName,
  getSubmitButton,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchObservationGroups } from '@plentyag/core/src/hooks/use-fetch-observation-groups/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { ScheduleType } from '@plentyag/core/src/types/environment';
import { DateTimeFormat, getShortenedPath } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonEditSchedule, dataTestIdsButtonEditSchedule as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onSuccess = jest.fn();

const [schedule] = mockSchedules;
const newValues = {
  scheduleType: ScheduleType.EVENT,
  description: 'newDescription',
  startsAt: '2022-01-01T00:00:00Z',
  activatesAt: '2022-01-02T00:00:00Z',
  endsAt: undefined,
  priority: 2,
  repeatInterval: 3600,
};

mockUseFetchObservationGroups();

describe('ButtonEditSchedule', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();

    const { container } = render(<ButtonEditSchedule onSuccess={onSuccess} schedule={schedule} disabled={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to update a Schedule', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({}, {}));
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'FULL' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonEditSchedule onSuccess={onSuccess} schedule={schedule} disabled={false} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    // -> Dialog is not visible
    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    // -> Click on Edit
    await actAndAwait(() => queryByTestId(dataTestIds.button).click());

    // -> Dialog is visible
    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    // -> Initial Values
    expect(getInputByName('path')).toHaveValue(getShortenedPath(schedule.path, true));
    expect(getInputByName('scheduleType')).toHaveValue(schedule.scheduleType);
    expect(getInputByName('description')).toHaveValue(schedule.description);
    expect(getInputByName('startsAt')).toHaveValue(
      DateTime.fromISO(schedule.startsAt).toFormat(DateTimeFormat.US_DEFAULT)
    );
    expect(getInputByName('activatesAt')).toHaveValue(
      DateTime.fromISO(schedule.activatesAt).toFormat(DateTimeFormat.US_DEFAULT)
    );
    expect(getInputByName('endsAt')).toHaveValue('');
    expect(getInputByName('priority')).toHaveValue(schedule.priority);
    expect(getInputByName('repeatInterval')).toHaveValue(schedule.repeatInterval);

    // Path is not editable.
    expect(getInputByName('path')).toBeDisabled();

    // -> Update the form
    await actAndAwait(() => openSelect('scheduleType'));
    await actAndAwait(() => chooseFromSelectByIndex(1));
    await actAndAwait(() => changeTextField('description', newValues.description));
    await actAndAwait(() => changeTextFieldDateTime('startsAt', newValues.startsAt));
    await actAndAwait(() => changeTextFieldDateTime('activatesAt', newValues.activatesAt));
    await actAndAwait(() => changeTextField('priority', newValues.priority));
    await actAndAwait(() => changeTextField('repeatInterval', newValues.repeatInterval));

    // -> Update the Schedule
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          path: schedule.path,
          scheduleType: newValues.scheduleType,
          description: newValues.description,
          startsAt: DateTime.fromISO(newValues.startsAt).toISO(),
          activatesAt: DateTime.fromISO(newValues.activatesAt).toISO(),
          priority: newValues.priority,
          repeatInterval: newValues.repeatInterval,
          updatedBy: 'olittle',
        }),
        url: EVS_URLS.schedules.updateUrl(schedule),
      })
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});
