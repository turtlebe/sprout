import { InfoOutlined } from '@material-ui/icons';
import { getAlertRuleTypeLabel, getAlertStateFromAlertRule } from '@plentyag/app-environment/src/common/utils';
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule, Metric, Subscription } from '@plentyag/core/src/types/environment';
import moment from 'moment';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  alertRuleType: (alertRule: AlertRule) => `metric-expanded-row-cell-type-${alertRule.id}`,
  alertRuleDescription: (alertRule: AlertRule) => `metric-expanded-row-cell-description-${alertRule.id}`,
  alertRuleStartsAt: (alertRule: AlertRule) => `metric-expanded-row-cell-starts-at-${alertRule.id}`,
  alertRuleEndsAt: (alertRule: AlertRule) => `metric-expanded-row-cell-ends-at-${alertRule.id}`,
  alertRuleStatus: (alertRule: AlertRule) => `metric-expanded-row-cell-status-${alertRule.id}`,
  alertRulePriority: (alertRule: AlertRule) => `metric-expanded-row-cell-priority-${alertRule.id}`,
  alertRuleRepeatInterval: (alertRule: AlertRule) => `metric-expanded-row-cell-repeat-interval-${alertRule.id}`,
  alertRuleLinearInterpolation: (alertRule: AlertRule) =>
    `metric-expanded-row-cell-linear-interpolation-${alertRule.id}`,
  alertRuleSubscription: (subscription: Subscription) => `metric-expanded-row-cell-subscription-${subscription.id}`,
};

export { dataTestIds as dataTestIdsMetricExpandedRow };

export interface MetricExpandedRow {
  metric: Metric;
}

export const format = 'MM/DD/YYYY hh:mm A';

export const MetricExpandedRow: React.FC<MetricExpandedRow> = ({ metric }) => {
  const classes = useStyles({});

  return (
    <Box overflow="auto">
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.cellHeader}>Type</TableCell>
              <TableCell className={classes.cellHeader}>Descripton</TableCell>
              <TableCell className={classes.cellHeader}>Start Time</TableCell>
              <TableCell className={classes.cellHeader}>End Time</TableCell>
              <TableCell className={classes.cellHeader}>Alert Status</TableCell>
              <TableCell className={classes.cellHeader}>Priority</TableCell>
              <TableCell className={classes.cellHeader}>Repeat Interval</TableCell>
              <TableCell className={classes.cellHeader}>Interpolation Type</TableCell>
              <TableCell className={classes.cellHeader}>Additional Info</TableCell>
              <TableCell className={classes.cellHeader}>Subscriptions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metric.alertRules.map(alertRule => (
              <TableRow key={alertRule.id}>
                <TableCell data-testid={dataTestIds.alertRuleType(alertRule)}>
                  {getAlertRuleTypeLabel(alertRule.alertRuleType)}
                </TableCell>
                <TableCell data-testid={dataTestIds.alertRuleDescription(alertRule)}>{alertRule.description}</TableCell>
                <TableCell data-testid={dataTestIds.alertRuleStartsAt(alertRule)}>
                  {moment(alertRule.startsAt).format(format)}
                </TableCell>
                <TableCell data-testid={dataTestIds.alertRuleEndsAt(alertRule)}>
                  {moment(alertRule.endsAt).format(format)}
                </TableCell>
                <TableCell data-testid={dataTestIds.alertRuleStatus(alertRule)}>
                  {getAlertStateFromAlertRule(alertRule)}
                </TableCell>
                <TableCell data-testid={dataTestIds.alertRulePriority(alertRule)}>{alertRule.priority}</TableCell>
                <TableCell data-testid={dataTestIds.alertRuleRepeatInterval(alertRule)}>
                  {alertRule.repeatInterval}
                </TableCell>
                <TableCell data-testid={dataTestIds.alertRuleLinearInterpolation(alertRule)}>
                  {alertRule.interpolationType}
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={
                      <>
                        <Typography>Last modified at: {moment(alertRule.updatedAt).format(format)}</Typography>
                        <Typography>Last modified by: {alertRule.updatedBy}</Typography>
                        <Typography>Tags: {alertRule.tags?.join(', ') || '--'}</Typography>
                        <Typography>No Data Timeout: {alertRule.noDataTimeout}</Typography>
                        <Typography>Duration Window Size: {alertRule.durationWindowSize}</Typography>
                        <Typography>Resolve Duration Window Size: {alertRule.durationWindowSizeResolve}</Typography>
                        <Typography>Stateful: {alertRule.isStateless ? 'No' : 'Yes'}</Typography>
                      </>
                    }
                  >
                    <InfoOutlined />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    {alertRule.subscriptions.map(subscription => (
                      <Tooltip
                        key={subscription.id}
                        title={
                          <>
                            <Typography>Type: {subscription.notificationType}</Typography>
                            <Typography>Method: {subscription.method}</Typography>
                            <Typography>Recipient: {subscription.to}</Typography>
                            <Typography>Duration: {subscription.notificationDuration || '--'}</Typography>
                            <Typography>Threshold: {subscription.notificationThreshold || '--'}</Typography>
                            <Typography>Distinct Source: {subscription.notificationDistinctSource || '--'}</Typography>
                            <Typography>Tags: {subscription.tags?.join(', ') || '--'}</Typography>
                            <Typography>Description: {subscription.description || '--'}</Typography>
                            <Typography>Priority: {subscription.priority || '--'}</Typography>
                          </>
                        }
                      >
                        <Chip
                          label={`${subscription.notificationType}/${subscription.method}`}
                          data-testid={dataTestIds.alertRuleSubscription(subscription)}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
