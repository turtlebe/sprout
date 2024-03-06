import {
  mockUseSwrAxiosImpl as mockAutocompleteFdsObjcetUseSwrAxiosImpl,
  root,
} from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import {
  chooseFromAutocompleteByIndex,
  chooseFromSelect,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait, buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { buildSchedule } from '@plentyag/core/src/test-helpers/mocks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { DialogSchedulePicker } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onChange = jest.fn();
const onClose = jest.fn();
const schedule = buildSchedule({
  path: 'sites/SSF2/areas/Seeding/scheduleDefinitions/ThermalHumidity',
  actions: [{ time: 0, valueType: 'MULTIPLE_VALUE', values: { mode: 'A', irrigation: '10' } }],
});
const seeding = root.sites['SSF2'].areas['Seeding'];

function renderDialogSchedulePicker(props?: Partial<DialogSchedulePicker>) {
  return render(
    <MemoryRouter>
      <DialogSchedulePicker open onClose={onClose} onChange={onChange} {...props} />
    </MemoryRouter>
  );
}

describe('DialogSchedulePicker', () => {
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

  it('renders without initial values', () => {
    renderDialogSchedulePicker();

    expect(getInputByName('farmDefObject')).toHaveValue('');
    expect(getInputByName('schedule')).toHaveValue('');
    expect(getInputByName('actionDefinitionKey')).not.toBeInTheDocument();
  });

  it('renders with initial values', async () => {
    const { queryByTestId } = renderDialogSchedulePicker({ schedule });

    expect(getInputByName('farmDefObject')).toHaveValue('SSF2/Seeding/');
    expect(getInputByName('schedule')).toHaveValue('ThermalHumidity');

    expect(onChange).toHaveBeenCalledTimes(0);

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        schedule,
        farmDefObject: seeding,
      })
    );
    expect(onChange).toHaveBeenCalledWith(
      expect.not.objectContaining({
        actionDefinitionKey: expect.anything(),
      })
    );
  });

  it('renders with an ActionDefinition Key Selector', async () => {
    const { queryByTestId } = renderDialogSchedulePicker({ schedule, chooseActionDefinitionKey: true });

    expect(getInputByName('farmDefObject')).toHaveValue('SSF2/Seeding/');
    expect(getInputByName('schedule')).toHaveValue('ThermalHumidity');
    expect(getInputByName('actionDefinitionKey')).toBeInTheDocument();

    await actAndAwait(() => openSelect('actionDefinitionKey'));
    await actAndAwait(() => chooseFromSelect('irrigation'));
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        schedule,
        farmDefObject: seeding,
        actionDefinitionKey: 'irrigation',
      })
    );
  });

  it('allows to choose multiple schedule', async () => {
    const { queryByTestId } = renderDialogSchedulePicker({ multiple: true });

    expect(getInputByName('farmDefObject')).toHaveValue('');
    expect(getInputByName('schedules')).toHaveValue('');

    await actAndAwait(() => openAutocomplete('farmDefObject'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => openAutocomplete('schedules'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        schedules: [schedule],
      })
    );
  });
});
