import { Add, Delete, Sort } from '@material-ui/icons';
import { StyledTableCell } from '@plentyag/app-environment/src/common/components';
import {
  getAdditionalDaysOptions,
  getAdditionalDaysValue,
  getIntervalStart,
} from '@plentyag/app-environment/src/common/utils';
import { ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
} from '@plentyag/brand-ui/src/material-ui/core';
import { KeyboardTimePicker } from '@plentyag/brand-ui/src/material-ui/pickers';
import React from 'react';

import { operators, Operators, useRuleHandlers } from '../../hooks';
import { TableAlertRuleEdit } from '../table-alert-rule-edit';

import { AlertRuleOperationTooltip, TextFieldRuleValue } from './components';

const dataTestIds = {
  root: 'table-alert-rule-edit-root',
  cellTime: (index: number) => `table-alert-rule-edit-cell-time-${index}`,
  cellDay: (index: number) => `table-alert-rule-edit-cell-day-${index}`,
  cellOperator: (index: number) => `table-alert-rule-edit-cell-operator-${index}`,
  cellValue: (index: number) => `table-alert-rule-edit-cell-value-${index}`,
  cellDelete: (index: number) => `table-alert-rule-edit-cell-delete-${index}`,
  cellRepeatInterval: 'table-alert-rule-edit-cell-repeat-interval',
  buttonAddRule: 'table-alert-rule-edit-button-add-time-range',
  buttonSortRules: 'table-alert-rule-edit-button-sort-time-ranges',
};

export { dataTestIds as dataTestIdsTableNonNumericalAlertRuleEdit };

export interface TableNonNumericalAlertRuleEdit extends Omit<TableAlertRuleEdit, 'metric'> {}

export const TableNonNumericalAlertRuleEdit: React.FC<TableNonNumericalAlertRuleEdit> = ({
  alertRule,
  onChange,
  'data-testid': dataTestId,
}) => {
  const { rules = [], repeatInterval = ONE_DAY } = alertRule;
  const {
    selectedOperators,
    handleAddRule,
    handleChangeTime,
    handleChangeDay,
    handleChangeOperator,
    handleChangeValue,
    handleDeleteRule,
    handleChangeRepeatInterval,
    handleSortRules,
  } = useRuleHandlers({ alertRule, onChange, defaultRule: { time: 0 } });
  const additonalDays = React.useMemo(() => getAdditionalDaysOptions(repeatInterval), [repeatInterval]);

  const ButtonAddRule = () => (
    <Button color="default" onClick={handleAddRule} data-testid={dataTestIds.buttonAddRule} startIcon={<Add />}>
      Add a Rule
    </Button>
  );

  return (
    <TableContainer data-testid={dataTestId ?? dataTestIds.root}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Time</StyledTableCell>
            <StyledTableCell align="left">
              Operation
              <AlertRuleOperationTooltip />
            </StyledTableCell>
            <StyledTableCell align="left">Value</StyledTableCell>
            <StyledTableCell align="right">
              <Button
                color="default"
                onClick={handleSortRules}
                data-testid={dataTestIds.buttonSortRules}
                startIcon={<Sort />}
              >
                Sort
              </Button>
              <ButtonAddRule />
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!rules.length && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <ButtonAddRule />
              </TableCell>
            </TableRow>
          )}
          {rules.map((rule, index) => (
            <TableRow key={index}>
              <TableCell align="left">
                <KeyboardTimePicker
                  inputVariant="outlined"
                  value={getIntervalStart(alertRule, new Date(), 1).add(rule.time, 'seconds')}
                  onChange={handleChangeTime(index)}
                  size="small"
                  data-testid={dataTestIds.cellTime(index)}
                />
                {repeatInterval > ONE_DAY && (
                  <>
                    <Box padding={1} display="inline" />
                    <TextField
                      label="Day"
                      variant="outlined"
                      size="small"
                      select
                      value={getAdditionalDaysValue(rule)}
                      inputProps={{ type: 'number' }}
                      onChange={event => {
                        handleChangeDay(index)(parseInt(event.target.value));
                      }}
                      data-testid={dataTestIds.cellDay(index)}
                    >
                      {additonalDays.map(additionalDay => (
                        <MenuItem key={additionalDay.value} value={additionalDay.value}>
                          {additionalDay.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </>
                )}
              </TableCell>
              <TableCell align="left">
                <TextField
                  select
                  label="Operation"
                  variant="outlined"
                  size="small"
                  value={selectedOperators[index]}
                  onChange={event => handleChangeOperator(index)(event.target.value as Operators)}
                  data-testid={dataTestIds.cellOperator(index)}
                >
                  {operators.map(operator => (
                    <MenuItem key={operator.value} value={operator.value}>
                      {operator.label}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
              <TableCell align="left">
                <TextFieldRuleValue
                  data-testid={dataTestIds.cellValue(index)}
                  rule={rule}
                  onChange={newValue => handleChangeValue(index, selectedOperators[index])(newValue)}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  icon={Delete}
                  color="default"
                  onClick={handleDeleteRule(index)}
                  data-testid={dataTestIds.cellDelete(index)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              <Box px={0} py={2} display="flex">
                <TextField
                  label="Repeat Interval (seconds)"
                  variant="outlined"
                  size="small"
                  defaultValue={alertRule.repeatInterval ?? ONE_DAY}
                  style={{ width: '250px' }}
                  inputProps={{ type: 'number' }}
                  onChange={event => handleChangeRepeatInterval(parseInt(event.currentTarget.value))}
                  data-testid={dataTestIds.cellRepeatInterval}
                />
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
