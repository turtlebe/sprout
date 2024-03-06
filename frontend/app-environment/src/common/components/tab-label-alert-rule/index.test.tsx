import '@plentyag/core/src/yup/extension';
import { mockAlertRules, mockMetrics } from '@plentyag/app-environment/src/common/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { changeTextField, getInputByName, getSubmitButton } from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { AlertRuleType } from '@plentyag/core/src/types/environment';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { EVS_URLS } from '../../utils';

import { dataTestIdsTabLabelAlertRule as dataTestIds, TabLabelAlertRule } from '.';

mockCurrentUser();

const [metric] = mockMetrics;
const [alertRule] = mockAlertRules;

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

const makePostRequest = jest.fn();
const makePutRequest = jest.fn();
const onAlertRuleChange = jest.fn();

function mockRequests() {
  makePostRequest.mockImplementation(({ onSuccess }) => onSuccess());
  makePutRequest.mockImplementation(({ onSuccess }) => onSuccess());
  mockUsePostRequest.mockReturnValue({ makeRequest: makePostRequest });
  mockUsePutRequest.mockReturnValue({ makeRequest: makePutRequest });
  mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes });
}

function renderTabLabelAlertRule() {
  return render(
    <MemoryRouter>
      <GlobalSnackbar>
        <TabLabelAlertRule metric={metric} alertRule={alertRule} onAlertRuleChange={onAlertRuleChange} />
      </GlobalSnackbar>
    </MemoryRouter>
  );
}

describe('TabLabelAlertRule', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
    makePostRequest.mockRestore();
    makePutRequest.mockRestore();
    onAlertRuleChange.mockRestore();
    mockRequests();
  });

  it('returns a label and a legend', () => {
    const { queryByTestId } = render(
      <TabLabelAlertRule
        metric={metric}
        alertRule={{ ...alertRule, alertRuleType: AlertRuleType.specLimit }}
        readOnly
      />
    );

    expect(queryByTestId(dataTestIds.dropdown)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.legend)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Spec Limit');
  });

  it('returns a label only for a non-numerical alert', () => {
    const { queryByTestId } = render(
      <TabLabelAlertRule
        metric={metric}
        alertRule={{ ...alertRule, alertRuleType: AlertRuleType.nonNumerical }}
        readOnly
      />
    );

    expect(queryByTestId(dataTestIds.dropdown)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.legend)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Alert');
  });

  it('opens a dialog', async () => {
    const { queryByTestId } = renderTabLabelAlertRule();

    expect(queryByTestId(dataTestIds.dropdown)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.edit)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogEdit)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.dropdown).click();

    expect(queryByTestId(dataTestIds.edit)).toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.edit).click());

    expect(queryByTestId(dataTestIds.dialogEdit)).toBeInTheDocument();
  });

  it('edits the AlertRule', async () => {
    const editedAlertRule = {
      ...alertRule,
      startsAt: DateTime.fromISO(alertRule.startsAt).toISO(),
      endsAt: DateTime.now().startOf('minute').toISO(),
      durationWindowSize: undefined,
      durationWindowSizeResolve: undefined,
      noDataTimeout: undefined,
      updatedBy: 'olittle',
    };
    const endsAtFormatted = DateTime.fromISO(editedAlertRule.endsAt).toFormat(DateTimeFormat.US_DEFAULT);
    const { queryByTestId } = renderTabLabelAlertRule();

    await actAndAwait(() => queryByTestId(dataTestIds.dropdown).click());
    await actAndAwait(() => queryByTestId(dataTestIds.edit).click());

    expect(getInputByName('startsAt')).toHaveValue(
      DateTime.fromISO(alertRule.startsAt).toFormat(DateTimeFormat.US_DEFAULT)
    );
    expect(getInputByName('alertRuleType')).toHaveValue(alertRule.alertRuleType);
    expect(getInputByName('endsAt')).toHaveValue('');

    await actAndAwait(() => changeTextField('endsAt', endsAtFormatted));

    expect(getInputByName('endsAt')).toHaveValue(endsAtFormatted);

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makePostRequest).not.toHaveBeenCalled();
    expect(makePutRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: editedAlertRule,
        url: EVS_URLS.alertRules.updateUrl(editedAlertRule),
      })
    );
    expect(onAlertRuleChange).toHaveBeenCalled();
  });
});
