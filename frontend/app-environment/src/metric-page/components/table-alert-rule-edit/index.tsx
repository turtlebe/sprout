import { Add, Delete, Sort } from '@material-ui/icons';
import { StyledTableCell } from '@plentyag/app-environment/src/common/components';
import { useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import {
  getAdditionalDaysOptions,
  getAdditionalDaysValue,
  getIntervalStartWithoutDst,
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
import { AlertRule, InterpolationType, Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

import { useRuleHandlers } from '../../hooks';

const dataTestIds = {
  root: 'table-alert-rule-edit-root',
  cellTime: (index: number) => `table-alert-rule-edit-cell-time-${index}`,
  cellDay: (index: number) => `table-alert-rule-edit-cell-day-${index}`,
  cellMin: (index: number) => `table-alert-rule-edit-cell-min-${index}`,
  cellMax: (index: number) => `table-alert-rule-edit-cell-max-${index}`,
  cellDelete: (index: number) => `table-alert-rule-edit-cell-delete-${index}`,
  cellRepeatInterval: 'table-alert-rule-edit-cell-repeat-interval',
  cellInterpolationType: 'table-alert-rule-edit-cell-interpolation-type',
  buttonAddRule: 'table-alert-rule-edit-button-add-time-range',
  buttonSortRules: 'table-alert-rule-edit-button-sort-time-ranges',
};

export { dataTestIds as dataTestIdsTableAlertRuleEdit };

export interface TableAlertRuleEdit {
  onChange: (alertRule: AlertRule) => void;
  metric: Metric;
  alertRule: AlertRule;
  'data-testid'?: string;
}

/**
 * Table that dispays an AlertRule's rule (configuration) in order to edit it.
 */
export const TableAlertRuleEdit: React.FC<TableAlertRuleEdit> = ({
  metric,
  alertRule,
  onChange,
  'data-testid': dataTestId,
}) => {
  const { getPreferredUnit } = useUnitConversion();
  const {
    handleAddRule,
    handleChangeTime,
    handleChangeDay,
    handleChangeMinMax,
    handleDeleteRule,
    handleChangeRepeatInterval,
    handleChangeInterpolationType,
    handleSortRules,
  } = useRuleHandlers({ alertRule, onChange, defaultRule: { time: 0 } });
  const { rules = [], repeatInterval = ONE_DAY } = alertRule;
  const additonalDays = React.useMemo(() => getAdditionalDaysOptions(repeatInterval), [repeatInterval]);
  const unitSymbol = React.useMemo(() => getPreferredUnit(metric.measurementType).symbol, [metric.measurementType]);

  return (
    <TableContainer data-testid={dataTestId ?? dataTestIds.root}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Time</StyledTableCell>
            <StyledTableCell align="left">Min ({unitSymbol})</StyledTableCell>
            <StyledTableCell align="left">Max ({unitSymbol})</StyledTableCell>
            <StyledTableCell align="right">
              <Button
                color="default"
                onClick={handleSortRules}
                data-testid={dataTestIds.buttonSortRules}
                startIcon={<Sort />}
              >
                Sort
              </Button>
              <Button
                color="default"
                onClick={handleAddRule}
                data-testid={dataTestIds.buttonAddRule}
                startIcon={<Add />}
                size="small"
              >
                Add Rule
              </Button>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.map((rule, index) => (
            <TableRow key={index}>
              <TableCell align="left">
                <KeyboardTimePicker
                  inputVariant="outlined"
                  value={getIntervalStartWithoutDst(alertRule).add(rule.time, 'seconds')}
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
                  variant="outlined"
                  value={rule.gte ?? ''}
                  onChange={handleChangeMinMax(index, 'gte')}
                  size="small"
                  inputProps={{ type: 'number' }}
                  data-testid={dataTestIds.cellMin(index)}
                />
              </TableCell>
              <TableCell align="left">
                <TextField
                  variant="outlined"
                  value={rule.lte ?? ''}
                  onChange={handleChangeMinMax(index, 'lte')}
                  size="small"
                  inputProps={{ type: 'number' }}
                  data-testid={dataTestIds.cellMax(index)}
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
                <Box padding={2} />
                <TextField
                  label="Interpolation Type"
                  variant="outlined"
                  size="small"
                  value={alertRule.interpolationType ?? InterpolationType.none}
                  style={{ width: '250px' }}
                  onChange={event => handleChangeInterpolationType(event.target.value as InterpolationType)}
                  data-testid={dataTestIds.cellInterpolationType}
                  select
                >
                  {Object.values(InterpolationType).map(interpolationType => (
                    <MenuItem key={interpolationType} value={interpolationType}>
                      {interpolationType}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
