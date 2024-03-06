import { mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import {
  changeTextField,
  chooseFromSelect,
  clickCheckbox,
  getInputByName,
  getSubmitButton,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { AlertRuleType } from '@plentyag/core/src/types/environment';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { DateTime } from 'luxon';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { EVS_URLS } from '../../utils';

import { ButtonCreateAlertRule, dataTestIdsButtonCreateAlertRule as dataTestIds } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const makePostRequest = jest.fn();
const makePutRequest = jest.fn();
const onSuccess = jest.fn();

const [metric] = mockMetrics;

mockCurrentUser();
mockUseFetchMeasurementTypes();

function renderButtonCreateAlertRule(metric) {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const rendered = render(
    <GlobalSnackbar>
      <MemoryRouter>
        <ButtonCreateAlertRule metric={metric} onSuccess={onSuccess} />
      </MemoryRouter>
    </GlobalSnackbar>
  );
  return { history, ...rendered };
}

describe('ButtonCreateAlertRule', () => {
  beforeEach(() => {
    onSuccess.mockRestore();
    mockUseSwrAxios.mockRestore();
    mockUsePostRequest.mockRestore();
    makePostRequest.mockRestore();
    makePutRequest.mockRestore();
    makePostRequest.mockImplementation(({ onSuccess }) => onSuccess());
  });

  it('creates an AlertRule and calls onSuccess', async () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    mockUsePostRequest.mockReturnValue({ makeRequest: makePostRequest, isLoading: false });
    mockUsePutRequest.mockReturnValue({ makeRequest: makePutRequest, isLoading: false });

    const { queryByTestId } = renderButtonCreateAlertRule(metric);

    expect(onSuccess).not.toHaveBeenCalled();

    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    const values = {
      startsAt: DateTime.now().startOf('minute').toISO(),
      alertRuleType: AlertRuleType.specLimit,
      isEnabled: true,
      metricId: metric.id,
      endsAt: undefined,
      description: undefined,
      priority: 1,
      createdBy: 'olittle',
      includeBaseDerivedDefinitions: undefined,
      durationWindowSize: 300,
      durationWindowSizeResolve: 240,
      noDataTimeout: 600,
    };

    // -> Open the Dialog
    await actAndAwait(() => queryByTestId(dataTestIds.root).click());

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();
    expect(getInputByName('alertRuleType')).toHaveValue('');

    // -> Choose an AlertRuleType
    await actAndAwait(() => openSelect('alertRuleType'));
    await actAndAwait(() => chooseFromSelect(values.alertRuleType));

    expect(getInputByName('alertRuleType')).toHaveValue(values.alertRuleType);

    // ->  Choose a Start Time
    await actAndAwait(() =>
      changeTextField('startsAt', DateTime.fromISO(values.startsAt).toFormat(DateTimeFormat.US_DEFAULT))
    );

    // ->  Choose a durationWindowSize
    await actAndAwait(() => changeTextField('durationWindowSize', values.durationWindowSize / 60));

    // ->  Choose a durationWindowSizeResolve
    await actAndAwait(() => changeTextField('durationWindowSizeResolve', values.durationWindowSizeResolve / 60));

    // ->  Choose a noDataTimeout
    await actAndAwait(() => changeTextField('noDataTimeout', values.noDataTimeout / 60));

    // -> Submit the form
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makePostRequest).toHaveBeenCalledWith(
      expect.objectContaining({ url: EVS_URLS.alertRules.createUrl(), data: values })
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(makePutRequest).not.toHaveBeenCalled();
  });

  it('creates an AlertRule and includes information for base/derived observation definitions', async () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    mockUsePostRequest.mockReturnValue({ makeRequest: makePostRequest, isLoading: false });
    mockUsePutRequest.mockReturnValue({ makeRequest: makePutRequest, isLoading: false });

    const values = {
      startsAt: DateTime.now().startOf('minute').toISO(),
      alertRuleType: AlertRuleType.controlLimit,
      isEnabled: true,
      metricId: metric.id,
      endsAt: undefined,
      description: undefined,
      durationWindowSize: undefined,
      durationWindowSizeResolve: undefined,
      noDataTimeout: undefined,
      priority: 1,
      createdBy: 'olittle',
      observationKey: { path: metric.path, observationName: metric.observationName },
      includeBaseDerivedDefinitions: true,
    };

    const { queryByTestId } = renderButtonCreateAlertRule(metric);

    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    // -> Open the Dialog
    queryByTestId(dataTestIds.root).click();

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    // -> Choose an AlertRuleType
    await actAndAwait(() => openSelect('alertRuleType'));
    await actAndAwait(() => chooseFromSelect(values.alertRuleType));

    // ->  Choose a Start Time
    await actAndAwait(() =>
      changeTextField('startsAt', DateTime.fromISO(values.startsAt).toFormat(DateTimeFormat.US_DEFAULT))
    );

    // ->  Choose a Start Time
    await actAndAwait(() =>
      changeTextField('startsAt', DateTime.fromISO(values.startsAt).toFormat(DateTimeFormat.US_DEFAULT))
    );

    // -> Check include Base/Derived Definitions
    await actAndAwait(() => clickCheckbox('includeBaseDerivedDefinitions'));

    // -> Submit the form
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makePostRequest).toHaveBeenCalledWith(
      expect.objectContaining({ data: values, url: EVS_URLS.alertRules.createUrl() })
    );
    expect(onSuccess).toHaveBeenCalled();
    expect(makePutRequest).not.toHaveBeenCalled();
  });
});
