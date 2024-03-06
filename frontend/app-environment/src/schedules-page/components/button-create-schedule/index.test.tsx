import '@plentyag/core/src/yup/extension';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjcetUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  changeTextFieldDateTime,
  chooseFromAutocompleteByIndex,
  chooseFromSelectByIndex,
  expectErrorOn,
  expectNoErrorOn,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { ScheduleType } from '@plentyag/core/src/types/environment';
import { fireEvent, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonCreateSchedule, dataTestIdsButtonCreateSchedule as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const values = {
  path: 'sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity',
  scheduleType: ScheduleType.CONTINUOUS,
  description: 'description',
  startsAt: '2021-12-01T00:00:00Z',
  activatesAt: '2021-12-01T00:00:00Z',
  endsAt: undefined,
  priority: 2,
  repeatInterval: 3600,
};

describe('ButtonCreateSchedule', () => {
  beforeEach(() => {
    mockUsePutRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    mockUseSwrAxios.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();

    const { container } = render(<ButtonCreateSchedule onSuccess={jest.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to create a Schedule', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({}, {}));
    const onSuccess = jest.fn();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });

    mockCurrentUser({ permissions: { HYP_ENVIRONMENT_V2: 'EDIT' } });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateSchedule onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.button).click());

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    // -> Initial Values
    expect(getInputByName('path')).toHaveValue('');
    expect(getInputByName('scheduleType')).toHaveValue('');
    expect(getInputByName('description')).toHaveValue('');
    expect(getInputByName('startsAt')).toHaveValue('');
    expect(getInputByName('activatesAt')).toHaveValue('');
    expect(getInputByName('endsAt')).toHaveValue('');
    expect(getInputByName('priority')).toHaveValue(1);
    expect(getInputByName('repeatInterval')).toHaveValue(ONE_DAY);

    // -> Submit the form
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    // -> Validations
    expectErrorOn('path');
    expectErrorOn('scheduleType');
    expectErrorOn('startsAt');
    expectErrorOn('activatesAt');

    // -> Fill the form
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1)); // Choose Site: SSF2
    await actAndAwait(() => chooseFromAutocompleteByIndex(0)); // Choose Area: Seeding
    await actAndAwait(() => chooseFromAutocompleteByIndex(0)); // Choose ScheduleDefinition: ThermalHumidity
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation
    await actAndAwait(() => openSelect('scheduleType'));
    await actAndAwait(() => chooseFromSelectByIndex(0));
    await actAndAwait(() => changeTextField('description', values.description));
    await actAndAwait(() => changeTextFieldDateTime('startsAt', values.startsAt));
    await actAndAwait(() => changeTextFieldDateTime('activatesAt', values.activatesAt));
    await actAndAwait(() => changeTextField('priority', values.priority));
    await actAndAwait(() => changeTextField('repeatInterval', values.repeatInterval));

    // -> No Errors
    expectNoErrorOn('path');
    expectNoErrorOn('scheduleType');
    expectNoErrorOn('description');
    expectNoErrorOn('startsAt');
    expectNoErrorOn('activatesAt');
    expectNoErrorOn('endsAt');
    expectNoErrorOn('priority');
    expectNoErrorOn('repeatInterval');

    // -> Submit the form again
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith({
      data: {
        path: values.path,
        scheduleType: values.scheduleType,
        description: values.description,
        startsAt: DateTime.fromISO(values.startsAt).toISO(),
        activatesAt: DateTime.fromISO(values.activatesAt).toISO(),
        priority: values.priority,
        repeatInterval: values.repeatInterval,
        createdBy: 'olittle',
      },
      url: EVS_URLS.schedules.createUrl(),
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
    expect(onSuccess).toHaveBeenCalled();
  }, 10000);
});
