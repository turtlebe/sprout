import {
  mockUseSwrAxiosImpl as mockAutocompleteFdsObjcetUseSwrAxiosImpl,
  root,
} from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import {
  chooseFromAutocomplete,
  chooseFromAutocompleteByIndex,
  expectErrorOn,
  expectErrorToBe,
  expectNoErrorOn,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
} from '@plentyag/brand-ui/src/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { mockScheduleDefinitions, mockSchedules } from '@plentyag/core/src/test-helpers/mocks/environment';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { DialogScheduleDefinitionPicker } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onChange = jest.fn();
const onClose = jest.fn();
const [scheduleDefinition] = mockScheduleDefinitions;
const schedules = [
  { ...mockSchedules[0], path: 'sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity' },
  { ...mockSchedules[0], path: 'sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity', priority: 1 },
];
const [schedule] = schedules;

function renderDialogScheduleDefinitionPicker(props?: Partial<DialogScheduleDefinitionPicker>) {
  return render(
    <MemoryRouter>
      <DialogScheduleDefinitionPicker
        scheduleDefinition={scheduleDefinition}
        open
        onClose={onClose}
        onChange={onChange}
        {...props}
      />
    </MemoryRouter>
  );
}

describe('DialogScheduleDefinitionPicker', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      if (args.url.includes('list-schedules')) {
        return { data: buildPaginatedResponse([schedule]), error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });
  });

  it('calls `onChange` with an existing schedule when there is no conflict', async () => {
    const { queryByTestId } = renderDialogScheduleDefinitionPicker();

    expect(getInputByName('path')).toHaveValue('');

    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocomplete('SSF2'));
    await actAndAwait(() => chooseFromAutocomplete('Seeding (1)'));
    await actAndAwait(() => chooseFromAutocomplete('ThermalHumidity'));

    expect(getInputByName('path')).toHaveValue('Schedule: SSF2/Seeding/ThermalHumidity/');

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledWith(schedule);
  });

  it('shows an error when the selected object is not a schedule or schedule definition', async () => {
    const { queryByTestId } = renderDialogScheduleDefinitionPicker();

    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocomplete('SSF2'));

    expectNoErrorOn('path');

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expectErrorOn('path');
    expectErrorToBe('path', 'You must choose a Schedule.');
  });

  it('renders with initial values', () => {
    renderDialogScheduleDefinitionPicker({ initialValue: schedule });

    expect(getInputByName('path')).toHaveValue('Schedule: SSF2/Seeding/ThermalHumidity/');
  });

  it('calls `onChange` with a schedule definition when no schedule exists', async () => {
    const data = buildPaginatedResponse([]);
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      if (args.url.includes('list-schedules')) {
        return { data, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });

    const { queryByTestId } = renderDialogScheduleDefinitionPicker();

    expect(getInputByName('path')).toHaveValue('');

    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocomplete('SSF2'));
    await actAndAwait(() => chooseFromAutocomplete('Seeding (1)'));
    await actAndAwait(() => chooseFromAutocomplete('ThermalHumidity'));

    expect(getInputByName('path')).toHaveValue('SSF2/Seeding/ThermalHumidity/');

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledWith(root.sites['SSF2'].areas['Seeding'].scheduleDefinitions['ThermalHumidity']);
  });

  it('calls `onChange` with an schedule when there is a conflict exists', async () => {
    const data = buildPaginatedResponse(schedules);
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      if (args.url.includes('list-schedules')) {
        return { data, error: undefined, isValidating: false };
      }

      return mockAutocompleteFdsObjcetUseSwrAxiosImpl(args);
    });

    const { queryByTestId } = renderDialogScheduleDefinitionPicker();

    expect(getInputByName('path')).toHaveValue('');

    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocomplete('SSF2'));
    await actAndAwait(() => chooseFromAutocomplete('Seeding (1)'));
    await actAndAwait(() => chooseFromAutocomplete('ThermalHumidity'));

    expect(getInputByName('path')).toHaveValue('SSF2/Seeding/ThermalHumidity/');

    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(getInputByName('path')).toHaveValue('Schedule: SSF2/Seeding/ThermalHumidity/');

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledWith(schedule);
  });
});
