import { mockAlertRules, mockSubscriptions } from '@plentyag/app-environment/src/common/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useDeleteRequest, usePostRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { TabType } from '@plentyag/core/src/types/environment';

import { dataTestIdsSubscriptionsPage as dataTestIds } from '.';

import { getMockUseSwrAxiosImplementation, renderSubscriptionsPage } from './test-helpers';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/core/src/hooks/use-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockDeleteRequest = useDeleteRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;

function mockRequests() {
  mockUsePostRequest.mockReturnValue({ makeRequest: jest.fn() });
  mockDeleteRequest.mockReturnValue({ makeRequest: jest.fn() });
}

mockCurrentUser();

describe('SubscriptionsPage', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
    mockDeleteRequest.mockRestore();
    mockUsePostRequest.mockRestore();
  });

  it('renders a loader', () => {
    mockRequests();
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true, error: undefined });

    const { queryByTestId } = renderSubscriptionsPage({ tabId: mockAlertRules[0].id });

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[0]))).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[1]))).not.toBeInTheDocument();
  });

  it('renders an empty placeholder when there is no subscriptions', () => {
    mockRequests();
    mockUseSwrAxios.mockImplementation(
      getMockUseSwrAxiosImplementation({
        alertRules: mockAlertRules,
        subscriptions: [],
      })
    );

    const { queryByTestId } = renderSubscriptionsPage({ tabId: mockAlertRules[0].id });

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[0]))).toHaveAttribute('aria-selected', 'true');
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[1]))).toHaveAttribute('aria-selected', 'false');
    expect(queryByTestId(dataTestIds.alertRuleTabPanel(mockAlertRules[0]))).toHaveTextContent('no Subscriptions');
  });

  it('renders a tab for each AlertRule', () => {
    mockRequests();
    mockUseSwrAxios.mockImplementation(
      getMockUseSwrAxiosImplementation({
        alertRules: mockAlertRules,
        subscriptions: mockSubscriptions,
      })
    );

    const { queryByTestId } = renderSubscriptionsPage({ tabId: mockAlertRules[0].id });

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[0]))).toHaveAttribute('aria-selected', 'true');
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[1]))).toHaveAttribute('aria-selected', 'false');
    expect(queryByTestId(dataTestIds.alertRuleTabPanel(mockAlertRules[0]))).not.toHaveTextContent('no Subscriptions');
  });

  it('forwards to the AlertRule tab', () => {
    mockRequests();
    mockUseSwrAxios.mockImplementation(
      getMockUseSwrAxiosImplementation({
        alertRules: mockAlertRules,
        subscriptions: mockSubscriptions,
      })
    );

    const { queryByTestId } = renderSubscriptionsPage({ tabType: TabType.alertEvents, tabId: 'all' });

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.alertRuleTab(mockAlertRules[0]))).toHaveAttribute('aria-selected', 'true');
  });
});
