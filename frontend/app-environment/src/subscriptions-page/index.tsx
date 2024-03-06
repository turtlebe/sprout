import { ArrowBack } from '@material-ui/icons';
import { HeaderMetric } from '@plentyag/app-environment/src/common/components';
import { useMetricTabs } from '@plentyag/app-environment/src/common/hooks';
import { EVS_URLS, getAlertRuleTypeLabel } from '@plentyag/app-environment/src/common/utils';
import { AppLayout, TabPanel, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useDeletedByHeader, useDeleteRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { AlertRule, Metric, Subscription, TabType } from '@plentyag/core/src/types/environment';
import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router';

import { PATHS } from '../paths';

import { ButtonCreateSubscription, TableSubscriptions } from './components';

const dataTestIds = {
  loader: 'subscriptions-page-content-loader',
  dropdown: 'subscriptions-page-dropdown',
  dropdownItemEdit: 'subscriptions-page-dropdown-item-edit',
  alertRuleTab: (alertRule: AlertRule) => `subscriptions-page-alert-rule-tab-${alertRule.id}`,
  alertRuleTabPanel: (alertRule: AlertRule) => `subscriptions-page-alert-rule-tab-panel-${alertRule.id}`,
  backToMetricPage: 'subscriptions-page-back-to-metric-page',
};

export { dataTestIds as dataTestIdsSubscriptionsPage };

export interface SubscriptionsPageUrlParams {
  metricId: string;
  tabType?: string;
  tabId?: string;
}

/**
 * Subscriptions Page lists all Subscriptions associated to AlertRules in separate Tabs.
 *
 * Users can create, update and delete existing Subscriptions.
 */
export const SubscriptionsPage: React.FC<RouteComponentProps<SubscriptionsPageUrlParams>> = ({ match }) => {
  const { metricId, tabType, tabId } = match.params;
  const history = useHistory();
  const snackbar = useGlobalSnackbar();
  const deletedByHeader = useDeletedByHeader();
  const { currentTab, parseTabValue, setTab, getTabId, tabType: currentTabType } = useMetricTabs({ tabType, tabId });

  // Requests
  const metric = useSwrAxios<Metric>({ url: EVS_URLS.metrics.getByIdUrl(metricId, { includeAlertRules: true }) });
  const subscriptions = useSwrAxios<PaginatedList<Subscription>>({
    url: EVS_URLS.subscriptions.listUrl({ alertRuleId: tabId }),
  });
  const deleteSubscription = useDeleteRequest({ headers: deletedByHeader });

  const requests = {
    metric,
    subscriptions,
    deleteSubscription,
  };

  const isLoading =
    (!requests.metric.data && requests.metric.isValidating) ||
    (!requests.subscriptions.data && requests.subscriptions.isValidating);
  const isReloading = requests.metric.isValidating || requests.subscriptions.isValidating;
  const currentMetric = metric.data;

  // handlers
  function handleTabChange(event: React.ChangeEvent<{}>, value: any) {
    const { type, id } = parseTabValue(value);
    history.push(`${PATHS.subscriptionsPageTab(metricId, type, id)}${history.location.search}`);
    setTab(type, id);
  }

  function handleSubscriptionsUpdated() {
    void requests.subscriptions.revalidate();
  }

  function handleDeleteSubscription(subscription: Subscription) {
    deleteSubscription.makeRequest({
      url: EVS_URLS.subscriptions.deleteUrl(subscription),
      onSuccess: () => void requests.subscriptions.revalidate(),
      onError: () => snackbar.errorSnackbar(),
    });
  }

  React.useEffect(() => {
    if (currentTabType === TabType.alertEvents && currentMetric && currentMetric.alertRules.length > 0) {
      const alertRuleId = currentMetric.alertRules[0].id;
      setTab(TabType.alertRule, alertRuleId);
      history.push(`${PATHS.subscriptionsPageTab(metricId, TabType.alertRule, alertRuleId)}${history.location.search}`);
    }
  }, [currentTabType, currentMetric]);

  if (currentTabType === TabType.alertEvents) {
    return null;
  }

  return (
    <AppLayout isLoading={isLoading || isReloading}>
      <HeaderMetric metric={currentMetric} isLoading={isLoading}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => history.push(PATHS.metricPageTab(currentMetric.id, tabType, tabId))}
            startIcon={<ArrowBack />}
            data-testid={dataTestIds.backToMetricPage}
          >
            Back to Metric Page
          </Button>
        </Box>
      </HeaderMetric>

      {!isLoading ? (
        <Box padding={2}>
          <Box display="flex" justifyContent="flex-end" paddingBottom={2}>
            <ButtonCreateSubscription alertRuleId={tabId} onSubscriptionCreated={handleSubscriptionsUpdated} />
          </Box>
          <Card>
            <Tabs value={currentTab} onChange={handleTabChange}>
              {currentMetric.alertRules.map(alertRule => (
                <Tab
                  key={alertRule.id}
                  data-testid={dataTestIds.alertRuleTab(alertRule)}
                  value={getTabId(TabType.alertRule, alertRule.id)}
                  wrapped={true}
                  label={getAlertRuleTypeLabel(alertRule.alertRuleType)}
                />
              ))}
            </Tabs>
            <Divider />
            {currentMetric.alertRules.map(alertRule => (
              <TabPanel
                key={alertRule.id}
                data-testid={dataTestIds.alertRuleTabPanel(alertRule)}
                value={currentTab}
                index={getTabId(TabType.alertRule, alertRule.id)}
              >
                {requests.subscriptions.data?.meta?.total > 0 ? (
                  <TableSubscriptions
                    subscriptions={requests.subscriptions.data.data}
                    onSubscriptionsUpdated={handleSubscriptionsUpdated}
                    onDeleteSubscription={handleDeleteSubscription}
                  />
                ) : (
                  <Box display="flex" justifyContent="center" padding={2}>
                    <Typography>There is currently no Subscriptions.</Typography>
                  </Box>
                )}
              </TabPanel>
            ))}
          </Card>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size="2rem" data-testid={dataTestIds.loader} />
        </Box>
      )}
    </AppLayout>
  );
};
