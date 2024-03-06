import { NoConfigurationPlaceholder, StyledTableCell } from '@plentyag/app-environment/src/common/components';
import {
  getAdditionalDaysLabel,
  getAdditionalDaysValue,
  getIntervalStart,
  getNonNumericalRuleOperator,
  getNonNumericalRuleValue,
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
import { AlertRuleType, Rule } from '@plentyag/core/src/types/environment';
import React from 'react';

import { TableAlertRuleReadOnly } from '..';

const dataTestIds = {
  root: 'table-non-numerical-alert-rule-read-only-root',
  tableRow: (rule: Rule) => `table-non-numerical-alert-rule-read-only-row-${rule.time}`,
  cellTime: (rule: Rule) => `table-alert-rule-read-only-cell-time-${rule.time}`,
  cellOperation: (rule: Rule) => `table-non-numerical-alert-rule-read-only-cell-time-${rule.time}`,
  cellValue: (rule: Rule) => `table-non-numerical-alert-rule-read-only-cell-min-${rule.time}`,
};

export { dataTestIds as dataTestIdsTableNonNumericalAlertRuleReadOnly };

export const TableNonNumericalAlertRuleReadOnly: React.FC<TableAlertRuleReadOnly> = ({
  alertRule,
  onConfigure,
  'data-testid': dataTestId,
}) => {
  if (!alertRule || ![AlertRuleType.nonNumerical].includes(alertRule.alertRuleType)) {
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
            <StyledTableCell align="left">Operation</StyledTableCell>
            <StyledTableCell align="left">Value</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alertRule.rules.map((rule, index) => (
            <TableRow key={index} data-testid={dataTestIds.tableRow(rule)}>
              <TableCell align="left" data-testid={dataTestIds.cellTime(rule)}>
                {getIntervalStart(alertRule, new Date(), 1).add(rule.time, 'seconds').format('hh:mm A')}
                &nbsp;
                {rule.time > ONE_DAY && getAdditionalDaysLabel(getAdditionalDaysValue(rule))}
              </TableCell>
              <TableCell align="left" data-testid={dataTestIds.cellOperation(rule)}>
                {getNonNumericalRuleOperator(rule)}
              </TableCell>
              <TableCell align="left" data-testid={dataTestIds.cellValue(rule)}>
                {getNonNumericalRuleValue(rule)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
