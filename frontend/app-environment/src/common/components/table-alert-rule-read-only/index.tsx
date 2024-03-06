import { NoConfigurationPlaceholder, StyledTableCell } from '@plentyag/app-environment/src/common/components';
import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import {
  getAdditionalDaysLabel,
  getAdditionalDaysValue,
  getIntervalStartWithoutDst,
} from '@plentyag/app-environment/src/common/utils';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { AlertRule, AlertRuleType, Metric, Rule } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {
  root: 'table-alert-rule-read-only-root',
  tableRow: (rule: Rule) => `table-alert-rule-read-only-row-${rule.time}`,
  cellTime: (rule: Rule) => `table-alert-rule-read-only-cell-time-${rule.time}`,
  cellMin: (rule: Rule) => `table-alert-rule-read-only-cell-min-${rule.time}`,
  cellMax: (rule: Rule) => `table-alert-rule-read-only-cell-max-${rule.time}`,
};

export { dataTestIds as dataTestIdsTableAlertRuleReadOnly };

export interface TableAlertRuleReadOnly {
  metric: Metric;
  alertRule: AlertRule;
  onConfigure: () => void;
  'data-testid'?: string;
}

export const TableAlertRuleReadOnly: React.FC<TableAlertRuleReadOnly> = ({
  metric,
  alertRule,
  onConfigure,
  'data-testid': dataTestId,
}) => {
  const { getPreferredUnit } = useUnitConversion();
  const unitSymbol = React.useMemo(() => getPreferredUnit(metric.measurementType).symbol, [metric.measurementType]);

  if (
    !alertRule ||
    ![AlertRuleType.specLimit, AlertRuleType.specLimitDevices, AlertRuleType.controlLimit].includes(
      alertRule.alertRuleType
    )
  ) {
    return null;
  }

  if (!alertRule.rules?.length || !alertRule.repeatInterval) {
    return (
      <NoConfigurationPlaceholder
        title="The AlertRule is not configured yet, start editing it now."
        onClick={onConfigure}
      />
    );
  }

  return (
    <TableContainer data-testid={dataTestId ?? dataTestIds.root}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Time</StyledTableCell>
            <StyledTableCell align="left">Min ({unitSymbol})</StyledTableCell>
            <StyledTableCell align="left">Max ({unitSymbol})</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alertRule.rules.map((rule, index) => (
            <TableRow key={index} data-testid={dataTestIds.tableRow(rule)}>
              <TableCell align="left" data-testid={dataTestIds.cellTime(rule)}>
                {getIntervalStartWithoutDst(alertRule).add(rule.time, 'seconds').format('hh:mm A')}
                &nbsp;
                {rule.time > ONE_DAY && getAdditionalDaysLabel(getAdditionalDaysValue(rule))}
              </TableCell>
              <TableCell align="left" data-testid={dataTestIds.cellMin(rule)}>
                {rule.gte ?? '--'}
              </TableCell>
              <TableCell align="left" data-testid={dataTestIds.cellMax(rule)}>
                {rule.lte ?? '--'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
