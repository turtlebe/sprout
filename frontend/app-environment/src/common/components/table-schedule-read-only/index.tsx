import { StyledTableCell } from '@plentyag/app-environment/src/common/components';
import { useUnitSymbol } from '@plentyag/app-environment/src/common/hooks';
import {
  adjustColor,
  getActionDefinitions,
  getAdditionalDaysLabel,
  getAdditionalDaysValue,
  getIntervalStartWithoutDst,
} from '@plentyag/app-environment/src/common/utils';
import { COLORS, ONE_DAY } from '@plentyag/app-environment/src/common/utils/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { Action, Schedule } from '@plentyag/core/src/types/environment';
import React from 'react';

import { NoConfigurationPlaceholder } from '..';

import { useStyles } from './styles';

const dataTestIds = {
  tableRow: (setpoint: Action) => `table-schedule-read-only-row-${setpoint.time}`,
  cellTime: (setpoint: Action) => `table-schedule-read-only-cell-time-${setpoint.time}`,
  cellValue: (setpoint: Action, key?: string) =>
    `table-schedule-read-only-cell-value-${setpoint.time}-${key ?? 'default'}`,
};

export { dataTestIds as dataTestIdsTableScheduleReadOnly };

export interface TableScheduleReadOnly {
  schedule: Schedule;
  scheduleDefinition: ScheduleDefinition;
}

export const TableScheduleReadOnly: React.FC<TableScheduleReadOnly> = ({ schedule, scheduleDefinition }) => {
  const { getUnitSymbol } = useUnitSymbol();
  const classes = useStyles({});

  if (!schedule) {
    return null;
  }

  if (!schedule.actions || schedule.actions.length === 0) {
    return <NoConfigurationPlaceholder title="The Schedule is not configured yet, start editing it now." />;
  }

  const actionDefinitions = getActionDefinitions(scheduleDefinition);

  return (
    <TableContainer>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" className={classes.sticky}>
              Time
            </StyledTableCell>
            {actionDefinitions.map(({ key, actionDefinition }, index) => (
              <StyledTableCell
                key={key ?? ''}
                align="left"
                style={{
                  color: adjustColor(COLORS.schedule, index),
                }}
              >
                {['Value', getUnitSymbol(actionDefinition), key && `- ${key}`].filter(Boolean).join(' ')}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.actions.map((setpoint, index) => (
            <TableRow key={index} data-testid={dataTestIds.tableRow(setpoint)}>
              <TableCell align="left" data-testid={dataTestIds.cellTime(setpoint)} className={classes.sticky}>
                {getIntervalStartWithoutDst(schedule).add(setpoint.time, 'seconds').format('hh:mm A')}
                &nbsp;
                {setpoint.time > ONE_DAY && getAdditionalDaysLabel(getAdditionalDaysValue(setpoint))}
              </TableCell>
              {actionDefinitions.map(({ key }, definitionIndex) => (
                <TableCell
                  key={key ?? ''}
                  align="left"
                  data-testid={dataTestIds.cellValue(setpoint, key)}
                  style={
                    key && {
                      color: adjustColor(COLORS.schedule, definitionIndex),
                    }
                  }
                >
                  {key ? setpoint.values[key] : setpoint.value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
