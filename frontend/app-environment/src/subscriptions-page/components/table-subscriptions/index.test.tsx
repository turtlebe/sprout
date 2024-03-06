import { mockSubscriptions } from '@plentyag/app-environment/src/common/test-helpers';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components';
import {
  changeTextArea,
  changeTextField,
  chooseFromSelect,
  getInputByName,
  getSubmitButton,
  getTextAreaByName,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest, usePutRequest } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { Subscription } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsTableSubscriptions as dataTestIds, TableSubscriptions } from '.';

mockCurrentUser();

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/brand-ui/src/components/feature-flag', () => ({
  useFeatureFlag: () => 'true',
}));

const onSubscriptionsUpdated = jest.fn();
const onDeleteSubscription = jest.fn();
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;

function renderTableSubscriptions(subscriptions: Subscription[]) {
  return render(
    <MemoryRouter>
      <GlobalSnackbar>
        <TableSubscriptions
          subscriptions={subscriptions}
          onSubscriptionsUpdated={onSubscriptionsUpdated}
          onDeleteSubscription={onDeleteSubscription}
        />
      </GlobalSnackbar>
    </MemoryRouter>
  );
}

describe('TableSubscriptions', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    onSubscriptionsUpdated.mockRestore();
    onDeleteSubscription.mockRestore();
  });

  it('renders an empty placeholder', () => {
    const { queryByTestId } = renderTableSubscriptions([]);

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('no Subscriptions');
  });

  it('renders a list of subscriptions', () => {
    const { queryByTestId } = renderTableSubscriptions(mockSubscriptions);

    expect(queryByTestId(dataTestIds.root)).not.toHaveTextContent('no Subscriptions');
    expect(mockSubscriptions).not.toHaveLength(0);
    mockSubscriptions.forEach(subscription => {
      expect(queryByTestId(dataTestIds.tableRow(subscription))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellType(subscription))).toHaveTextContent(subscription.notificationType);
      expect(queryByTestId(dataTestIds.cellMethod(subscription))).toHaveTextContent(subscription.method);
      expect(queryByTestId(dataTestIds.cellTo(subscription))).toHaveTextContent(subscription.to);
      expect(queryByTestId(dataTestIds.cellThreshold(subscription))).toBeEmptyDOMElement();
      expect(queryByTestId(dataTestIds.cellDuration(subscription))).toBeEmptyDOMElement();
      expect(queryByTestId(dataTestIds.cellDistincSource(subscription))).toBeEmptyDOMElement();
      expect(queryByTestId(dataTestIds.cellRenotifyPeriod(subscription))).toBeEmptyDOMElement();
    });

    const opsGenieSubscription = mockSubscriptions[1];
    expect(queryByTestId(dataTestIds.cellPriority(opsGenieSubscription))).toHaveTextContent(
      opsGenieSubscription.priority
    );
    expect(queryByTestId(dataTestIds.cellDescription(opsGenieSubscription))).toHaveTextContent(
      opsGenieSubscription.description
    );
  });

  it('renders a subscriptions with notification attributes', () => {
    const subscriptions = [
      {
        ...mockSubscriptions[0],
        notificationThreshold: 10,
        notificationDuration: 3600,
        notificationDistinctSource: true,
        description: 'mockDescription',
        renotifyPeriod: 660,
        tags: ['tag1', 'tag2'],
      },
    ];
    const { queryByTestId } = renderTableSubscriptions(subscriptions);

    expect(queryByTestId(dataTestIds.root)).not.toHaveTextContent('no Subscriptions');
    expect(mockSubscriptions).not.toHaveLength(0);
    subscriptions.forEach(subscription => {
      expect(queryByTestId(dataTestIds.tableRow(subscription))).toBeInTheDocument();
      expect(queryByTestId(dataTestIds.cellMethod(subscription))).toHaveTextContent(subscription.method);
      expect(queryByTestId(dataTestIds.cellTo(subscription))).toHaveTextContent(subscription.to);
      expect(queryByTestId(dataTestIds.cellDescription(subscription))).toHaveTextContent('mockDescription');
      expect(queryByTestId(dataTestIds.cellThreshold(subscription))).toHaveTextContent('10');
      expect(queryByTestId(dataTestIds.cellDuration(subscription))).toHaveTextContent('60');
      expect(queryByTestId(dataTestIds.cellDistincSource(subscription))).toHaveTextContent('Yes');
      expect(queryByTestId(dataTestIds.cellTags(subscription))).toHaveTextContent(subscription.tags.join(', '));
      expect(queryByTestId(dataTestIds.cellRenotifyPeriod(subscription))).toHaveTextContent('11');
    });
  });

  it('edits a subscription', async () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess());
    mockUsePutRequest.mockReturnValue({ makeRequest, isLoading: false });
    mockUsePostRequest.mockReturnValue({ makeRequest: jest.fn(), isLoading: false });

    const { queryByTestId } = renderTableSubscriptions(mockSubscriptions);

    expect(queryByTestId(dataTestIds.dialogEditSubscription)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogDeleteSubscription.root)).not.toBeInTheDocument();
    expect(getInputByName('notificationType')).not.toBeInTheDocument();
    expect(getInputByName('method')).not.toBeInTheDocument();
    expect(getInputByName('to')).not.toBeInTheDocument();
    await actAndAwait(() => queryByTestId(dataTestIds.editSubscription(mockSubscriptions[0])).click());

    expect(queryByTestId(dataTestIds.dialogEditSubscription)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogDeleteSubscription.root)).not.toBeInTheDocument();
    expect(getInputByName('notificationType')).toBeInTheDocument();
    expect(getInputByName('method')).toBeInTheDocument();
    expect(getInputByName('to')).toBeInTheDocument();
    expect(getTextAreaByName('description')).toBeInTheDocument();
    expect(getInputByName('method')).toHaveValue(mockSubscriptions[0].method);
    expect(getInputByName('priority')).not.toBeInTheDocument();

    // -> Change NotificationType
    await actAndAwait(() => openSelect('notificationType'));
    await actAndAwait(() => chooseFromSelect('NO_DATA'));

    // -> Change method
    await actAndAwait(() => openSelect('method'));
    await actAndAwait(() => chooseFromSelect('OPS_GENIE'));

    expect(getInputByName('method')).toHaveValue('OPS_GENIE');
    expect(getInputByName('priority')).toBeInTheDocument();
    expect(getInputByName('priority')).toHaveValue('');

    // -> Choose a priority
    await actAndAwait(() => openSelect('priority'));
    await actAndAwait(() => chooseFromSelect('P1'));

    expect(getInputByName('priority')).toHaveValue('P1');

    // -> Enter a threshold
    changeTextField('notificationThreshold', 10);

    expect(getInputByName('notificationThreshold')).toHaveValue(10);

    // -> Enter a duration
    changeTextField('notificationDuration', 60);

    expect(getInputByName('notificationDuration')).toHaveValue(60);

    // -> Enter a description
    changeTextArea('description', 'updatedMockDescription');

    expect(getTextAreaByName('description')).toHaveValue('updatedMockDescription');

    // -> Choose distinct source
    await actAndAwait(() => openSelect('notificationDistinctSource'));
    await actAndAwait(() => chooseFromSelect('true'));

    // -> Add tags
    await actAndAwait(() => openAutocomplete('tags'));
    await actAndAwait(() => changeTextField('tags', 'tag1'));
    await actAndAwait(() => document.querySelector<HTMLLIElement>('#tags-option-0').click());
    await actAndAwait(() => changeTextField('tags', 'tag2'));
    await actAndAwait(() => document.querySelector<HTMLLIElement>('#tags-option-0').click());

    // -> Enter a renotify period
    changeTextField('renotifyPeriod', 12);

    expect(getInputByName('renotifyPeriod')).toHaveValue(12);

    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          ...mockSubscriptions[0],
          notificationType: 'NO_DATA',
          notificationThreshold: 10,
          notificationDuration: 3600,
          notificationDistinctSource: true,
          renotifyPeriod: 720,
          method: 'OPS_GENIE',
          priority: 'P1',
          tags: ['tag1', 'tag2'],
          updatedBy: 'olittle',
          description: 'updatedMockDescription',
        },
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
        url: EVS_URLS.subscriptions.updateUrl(mockSubscriptions[0]),
      })
    );
    expect(onSubscriptionsUpdated).toHaveBeenCalled();
  });

  it('deletes a subscription', async () => {
    const { queryByTestId } = renderTableSubscriptions(mockSubscriptions);

    expect(queryByTestId(dataTestIds.dialogEditSubscription)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogDeleteSubscription.root)).not.toBeInTheDocument();

    await actAndAwait(() => queryByTestId(dataTestIds.deleteSubscription(mockSubscriptions[0])).click());

    expect(queryByTestId(dataTestIds.dialogEditSubscription)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialogDeleteSubscription.root)).toBeInTheDocument();

    queryByTestId(dataTestIds.dialogDeleteSubscription.confirm).click();
    expect(onDeleteSubscription).toHaveBeenCalledWith(mockSubscriptions[0]);
  });
});
