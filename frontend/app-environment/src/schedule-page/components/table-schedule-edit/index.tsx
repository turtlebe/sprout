import { Add, Delete, FileCopy, Sort } from '@material-ui/icons';
import { StyledTableCell } from '@plentyag/app-environment/src/common/components';
import { useUnitSymbol } from '@plentyag/app-environment/src/common/hooks';
import {
  adjustColor,
  copySchedule,
  getActionDefinitions,
  getActionInitialValue,
  getAdditionalDaysOptions,
  getAdditionalDaysValue,
  getDurationInSecondsWith,
  getIntervalStartWithoutDst,
  isContinuousSchedule,
  isNumericalSchedule,
  isScheduleDefinitionActionsEqual,
  isSingleValueScheduleDefinition,
} from '@plentyag/app-environment/src/common/utils';
import { COLORS, ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import { Show } from '@plentyag/brand-ui/src/components';
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
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Action, InterpolationType, Schedule } from '@plentyag/core/src/types/environment';
import { getArrayWithUpdatedIndex, isValidDate } from '@plentyag/core/src/utils';
import React from 'react';

import { ActionValueInput, CopyValueAcrossRow } from './components';
import { useStyles } from './styles';

const dataTestIds = {
  buttonAddAction: 'table-schedule-edit-button-add-action',
  buttonSortActions: 'table-schedule-edit-button-sort-actions',
  tableRow: (index: number) => `table-schedule-edit-row-${index}`,
  tableRowCopy: (index: number) => `table-schedule-edit-row-copy-${index}`,
  cellTime: (index: number) => `table-schedule-edit-cell-time-${index}`,
  cellDay: (index: number) => `table-schedule-edit-cell-day-${index}`,
  cellValue: (index: number, key?: string) => `table-schedule-edit-cell-value-${index}-${key ?? 'default'}`,
  cellDelete: (index: number) => `table-schedule-edit-cell-delete-${index}`,
  cellCopy: (index: number) => `table-schedule-edit-cell-copy-${index}`,
  cellRepeatInterval: 'table-schedule-edit-cell-repeat-interval',
  cellInterpolationType: 'table-schedule-edit-cell-interpolation-type',
};

export { dataTestIds as dataTestIdsTableScheduleEdit };

export interface TableScheduleEdit {
  schedule: Schedule;
  scheduleDefinition: ScheduleDefinition;
  onChange: (schedule: Schedule) => void;
}

/**
 * Component that displays and allows editing of the Schedule's Actions in a Table
 */
export const TableScheduleEdit: React.FC<TableScheduleEdit> = ({ schedule, scheduleDefinition, onChange }) => {
  const classes = useStyles({});
  const { getUnitSymbol } = useUnitSymbol();
  const { actions, repeatInterval } = schedule;
  const additonalDays = React.useMemo(() => getAdditionalDaysOptions(repeatInterval), [repeatInterval]);

  const [copyActionValueAcrossRow, setCopyActionValueAcrossRow] = React.useState<boolean[]>(actions.map(() => false));

  /**
   * Copy the Schedule and change add a new Action.
   */
  const handleAddAction = () => {
    const newAction: Action = isSingleValueScheduleDefinition(scheduleDefinition)
      ? {
          time: 0,
          value: getActionInitialValue(getActionDefinitions(scheduleDefinition)[0].actionDefinition),
          valueType: 'SINGLE_VALUE',
        }
      : {
          time: 0,
          values: getActionDefinitions(scheduleDefinition).reduce((result, { key, actionDefinition }) => {
            result[key] = getActionInitialValue(actionDefinition);
            return result;
          }, {}),
          valueType: 'MULTIPLE_VALUE',
        };
    const newActions: Action[] = [...actions, newAction];

    onChange(copySchedule({ schedule, newActions, sortAcions: false }));
  };

  /**
   * Copy the Schedule and change the time of an Action.
   */
  const handleChangeTime = (index: number) => (newDate: Date) => {
    if (!isValidDate(newDate)) {
      return;
    }

    const time = getDurationInSecondsWith(schedule, newDate, getAdditionalDaysValue(actions[index]));

    const newActions: Action[] = [...actions.slice(0, index), { ...actions[index], time }, ...actions.slice(index + 1)];

    onChange(copySchedule({ schedule, newActions, sortAcions: false }));
  };

  /**
   * Copy the Schedule change its repeatInterval.
   */
  const handleChangeRepeatInterval = (newRepeatInterval: number) => {
    onChange({ ...schedule, repeatInterval: newRepeatInterval });
  };

  /**
   * Copy the Schedule change its InterpolationType.
   */
  const handleChangeInterpolationType = (newInterpolationType: InterpolationType) => {
    onChange({
      ...schedule,
      interpolationType: newInterpolationType,
    });
  };

  /**
   * Copy the Schedule and change the day of an Action.
   */
  const handleChangeDay = (index: number) => (additionalDay: number) => {
    const time = getDurationInSecondsWith(
      schedule,
      getIntervalStartWithoutDst(schedule).add(actions[index].time, 'seconds').toDate(),
      additionalDay
    );

    const newActions: Action[] = [...actions.slice(0, index), { ...actions[index], time }, ...actions.slice(index + 1)];

    onChange(copySchedule({ schedule, newActions, sortAcions: false }));
  };

  /**
   * Copy the Schedule and change the value of an Action.
   */
  const handleChangeValue = (key: string, index: number) => (newInputValue: string) => {
    const newAction: Action = key
      ? { ...actions[index], values: { ...actions[index].values, [key]: newInputValue } }
      : { ...actions[index], value: newInputValue };
    const newActions: Action[] = [...actions.slice(0, index), newAction, ...actions.slice(index + 1)];

    onChange(copySchedule({ schedule, newActions, sortAcions: false }));
  };

  /**
   * Copy the Schedule and remove an Action.
   */
  const handleDeleteAction = (index: number) => () => {
    const newActions: Action[] = [...actions.slice(0, index), ...actions.slice(index + 1)];

    onChange(copySchedule({ schedule, newActions, sortAcions: false }));
  };

  /**
   * Copy the Schedule and sort its Actions.
   */
  const handleSortActions = () => {
    onChange(copySchedule({ schedule }));
  };

  /**
   * Copy Action values across all fields with a selector.
   */
  const handleCopyAction = (index: number) => () => {
    setCopyActionValueAcrossRow(getArrayWithUpdatedIndex(copyActionValueAcrossRow, true, index));
  };

  /**
   * Cancels Copy Action values across all fields with a selector.
   */
  const handleCancelCopyActionsAcrossRow = (index: number) => () => {
    setCopyActionValueAcrossRow(getArrayWithUpdatedIndex(copyActionValueAcrossRow, false, index));
  };

  /**
   * Update action values across row based on measurement type.
   */
  const handleCopyActionValueAcrossRow = (index: number) => (actionValueForRow: string) => {
    const updatedAction: Action = {
      ...actions[index],
      values: getActionDefinitions(scheduleDefinition).reduce((result, { key }) => {
        result[key] = actionValueForRow;
        return result;
      }, {}),
    };
    const newActions: Action[] = getArrayWithUpdatedIndex(actions, updatedAction, index);

    onChange(copySchedule({ schedule, newActions, sortAcions: false }));
    // Reset row back to regular view
    setCopyActionValueAcrossRow(copyActionValueAcrossRow.map(() => false));
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" className={classes.timeHeader}>
              Time
            </StyledTableCell>
            {getActionDefinitions(scheduleDefinition).map(({ key, actionDefinition }, index) => (
              <StyledTableCell
                key={key ?? 'singleActionDefinition'}
                align="left"
                style={{ color: adjustColor(COLORS.schedule, index) }}
              >
                {['Value', getUnitSymbol(actionDefinition), key && `- ${key}`].filter(Boolean).join(' ')}
              </StyledTableCell>
            ))}
            <StyledTableCell align="right">
              <Button
                color="default"
                onClick={handleSortActions}
                data-testid={dataTestIds.buttonSortActions}
                startIcon={<Sort />}
              >
                Sort
              </Button>
              <Button
                color="default"
                onClick={handleAddAction}
                data-testid={dataTestIds.buttonAddAction}
                startIcon={<Add />}
              >
                Add an Action
              </Button>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {actions.map((action, index) =>
            copyActionValueAcrossRow[index] ? (
              <TableRow key={index} data-testid={dataTestIds.tableRowCopy(index)}>
                <TableCell colSpan={getActionDefinitions(scheduleDefinition).length + 1} align="right">
                  <CopyValueAcrossRow
                    scheduleDefinition={scheduleDefinition}
                    onCancel={handleCancelCopyActionsAcrossRow(index)}
                    onCopyActionValueAcrossRow={handleCopyActionValueAcrossRow(index)}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={index} data-testid={dataTestIds.tableRow(index)}>
                <TableCell align="left">
                  <KeyboardTimePicker
                    inputVariant="outlined"
                    value={getIntervalStartWithoutDst(schedule).add(action.time, 'seconds')}
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
                        value={getAdditionalDaysValue(action)}
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
                {getActionDefinitions(scheduleDefinition).map(({ key, actionDefinition }) => (
                  <TableCell key={key ?? 'singleActionDefinition'} align="left">
                    <ActionValueInput
                      actionDefinition={actionDefinition}
                      actionValue={key ? action.values[key] : action.value}
                      onChangeActionValue={actionValue => handleChangeValue(key, index)(actionValue)}
                      onBlurActionValue={actionValue => handleChangeValue(key, index)(actionValue)}
                      data-testid={dataTestIds.cellValue(index, key)}
                    />
                  </TableCell>
                ))}
                <TableCell align="right">
                  <Box display="flex">
                    <Show
                      when={
                        !isSingleValueScheduleDefinition(scheduleDefinition) &&
                        isScheduleDefinitionActionsEqual(scheduleDefinition)
                      }
                    >
                      <IconButton
                        icon={FileCopy}
                        color="default"
                        onClick={handleCopyAction(index)}
                        data-testid={dataTestIds.cellCopy(index)}
                      />
                    </Show>
                    <IconButton
                      icon={Delete}
                      color="default"
                      onClick={handleDeleteAction(index)}
                      data-testid={dataTestIds.cellDelete(index)}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              <Box px={0} py={2} display="flex">
                <TextField
                  label="Repeat Interval (seconds)"
                  variant="outlined"
                  size="small"
                  defaultValue={repeatInterval ?? ONE_DAY}
                  style={{ width: '250px' }}
                  inputProps={{ type: 'number' }}
                  onChange={event => handleChangeRepeatInterval(parseInt(event.currentTarget.value))}
                  data-testid={dataTestIds.cellRepeatInterval}
                />
                <Box padding={2} />
                {isNumericalSchedule(scheduleDefinition) && isContinuousSchedule(schedule) && (
                  <TextField
                    label="Interpolation Type"
                    variant="outlined"
                    size="small"
                    value={schedule.interpolationType ?? InterpolationType.none}
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
                )}
              </Box>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
