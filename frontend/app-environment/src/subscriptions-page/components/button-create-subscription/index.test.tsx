import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextArea,
  changeTextField,
  chooseFromSelect,
  getInputByName,
  getSubmitButton,
  getTextAreaByName,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { SubscriptionNotificationType } from '@plentyag/core/src/types/environment';
import { toMinutes } from '@plentyag/core/src/utils';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ButtonCreateSubscription, dataTestIdsButtonCreateSubscription as dataTestIds } from '.';

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onSuccess = jest.fn();

jest.mock('@plentyag/core/src/hooks');
jest.mock('@plentyag/brand-ui/src/components/feature-flag', () => ({
  useFeatureFlag: () => 'true',
}));

describe('ButtonCreateSubscription', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    onSuccess.mockRestore();
  });

  it('opens a dialog to create a Subscription', async () => {
    const subscription = {
      alertRuleId: 'alert-rule-id',
      notificationType: SubscriptionNotificationType.default,
      method: 'OPS_GENIE',
      to: 'llee',
      notificationThreshold: 10,
      notificationDuration: 3600,
      notificationDistinctSource: false,
      priority: 'P1',
      description: 'mockDescription',
    };
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess(subscription));
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });
    mockUsePutRequest.mockReturnValue({ makeRequest: jest.fn(), isLoading: false });
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false, error: undefined });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateSubscription alertRuleId={subscription.alertRuleId} onSubscriptionCreated={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.createSubscription)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.createSubscription).click();

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    expect(getInputByName('notificationType')).toBeInTheDocument();
    expect(getInputByName('method')).toBeInTheDocument();
    expect(getInputByName('to')).toBeInTheDocument();
    expect(getInputByName('notificationThreshold')).toBeInTheDocument();
    expect(getInputByName('notificationDuration')).toBeInTheDocument();
    expect(getInputByName('notificationDistinctSource')).toBeInTheDocument();
    expect(getTextAreaByName('description')).toBeInTheDocument();
    expect(getInputByName('priority')).not.toBeInTheDocument();
    expect(getInputByName('method')).toHaveValue('');

    // -> Choose method
    await actAndAwait(() => openSelect('method'));
    await actAndAwait(() => chooseFromSelect(subscription.method));

    expect(getInputByName('method')).toHaveValue('OPS_GENIE');
    expect(getInputByName('priority')).toBeInTheDocument();
    expect(getInputByName('priority')).toHaveValue('');

    // -> Choose a `To` (recipient)
    changeTextField('to', subscription.to);

    expect(getInputByName('to')).toHaveValue(subscription.to);

    // -> Enter a threshold
    changeTextField('notificationThreshold', subscription.notificationThreshold);

    expect(getInputByName('notificationThreshold')).toHaveValue(subscription.notificationThreshold);

    // -> Enter a duration
    changeTextField('notificationDuration', toMinutes(subscription.notificationDuration));

    expect(getInputByName('notificationDuration')).toHaveValue(toMinutes(subscription.notificationDuration));

    // -> Choose distinct source
    await actAndAwait(() => openSelect('notificationDistinctSource'));
    await actAndAwait(() => chooseFromSelect(subscription.notificationDistinctSource.toString()));

    expect(getInputByName('notificationDistinctSource')).toHaveValue(
      subscription.notificationDistinctSource.toString()
    );

    // -> Choose a priority
    await actAndAwait(() => openSelect('priority'));
    await actAndAwait(() => chooseFromSelect(subscription.priority));

    expect(getInputByName('priority')).toHaveValue(subscription.priority);

    // -> Choose a description
    changeTextArea('description', subscription.description);
    expect(getTextAreaByName('description')).toHaveValue(subscription.description);

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: subscription,
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
        url: EVS_URLS.subscriptions.createUrl(),
      })
    );
    expect(onSuccess).toHaveBeenCalledWith(subscription);
  });
});
