import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { PlentyLink, StatusLabel, StatusLabelLevel } from '@plentyag/brand-ui/src/components';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@plentyag/brand-ui/src/material-ui/core';
import { getKindFromPath } from '@plentyag/core/src/farm-def/utils';
import { DateTimeFormat, getLuxonDateTime, toQueryParams } from '@plentyag/core/src/utils';
import React from 'react';

import { CreatedTask } from '../../types';

import { useStyles } from './styles';

const dataTestIds = {
  root: 'finished-step-root',
  reset: 'finished-step-reset',
  taskDetails: (nodeId: string) => `finished-step-task-details-${nodeId}`,
};

export { dataTestIds as dataTestIdsFinishedStep };

export interface FinishedStep {
  reactorsAndTasksDetailBasePath: string;
  workcentersBasePath: string;
  createdTasks: CreatedTask[];
  onReset?: () => void;
  onError?: (err: Error) => void;
  'data-testid'?: string;
}

export const FinishedStep: React.FC<FinishedStep> = ({
  reactorsAndTasksDetailBasePath,
  workcentersBasePath,
  createdTasks,
  onReset = () => {},
  'data-testid': dataTestId,
}) => {
  const classes = useStyles({});

  function handleReset() {
    onReset();
  }

  return (
    <Box data-testid={dataTestId ?? dataTestIds.root}>
      <Box display="flex" alignItems="center">
        <CheckCircleOutlineIcon fontSize="large" htmlColor="#30a14e" />
        <span>Tasks have been created!</span>
      </Box>

      <TableContainer component={Box} m={1} className={classes.tableContainer}>
        <Table stickyHeader aria-label="tasks" size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>Status</TableCell>
              <TableCell className={classes.tableHeader}>Plan Date</TableCell>
              <TableCell className={classes.tableHeader}>Workcenter</TableCell>
              <TableCell className={classes.tableHeader}>Task</TableCell>
              <TableCell className={classes.tableHeader}>Title</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {createdTasks.map(row => {
              const { workcenterTask: task, plannedDate } = row;
              const nodeId = task.taskDetails.id;
              const workcenter = getKindFromPath(task.taskDetails.workcenter, 'workCenters');
              const taskId = task.taskDetails.id;
              const reactorPath = task.executionDetails.executingReactorPath;
              const taskType = task.executionDetails.taskInstance.type;
              const tasksDetailsLink = `${reactorsAndTasksDetailBasePath}/${reactorPath}${toQueryParams({ taskId })}`;
              const planLink = `${workcentersBasePath}/${workcenter}${toQueryParams({ planDate: plannedDate })}`;

              return (
                <TableRow key={nodeId} data-testid={dataTestIds.taskDetails(nodeId)}>
                  <TableCell>
                    <StatusLabel level={StatusLabelLevel.IDLE} text={task.executionDetails.taskStatus} />
                  </TableCell>
                  <TableCell>
                    <PlentyLink to={planLink} openInNewTab>
                      {getLuxonDateTime(plannedDate).toFormat(DateTimeFormat.DATE_ONLY)}
                    </PlentyLink>
                  </TableCell>
                  <TableCell>{workcenter}</TableCell>
                  <TableCell>{taskType}</TableCell>
                  <TableCell>
                    <PlentyLink to={tasksDetailsLink} openInNewTab>
                      {task.taskDetails.title}
                    </PlentyLink>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Box>
          <Button variant="contained" color="secondary" onClick={handleReset} data-testid={dataTestIds.reset}>
            Start Over
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
