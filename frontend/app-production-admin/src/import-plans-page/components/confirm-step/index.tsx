import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import React from 'react';

import { UploadBulkCreateTasks } from '../../types';

import { useGetTableData } from './hooks/use-get-table-data';
import { useStyles } from './styles';

const dataTestIds = {
  root: 'confirm-step-root',
  taskDetails: (nodeId: string) => `confirm-step-task-details-${nodeId}`,
};

export { dataTestIds as dataTestIdsConfirmStep };

export interface ConfirmStep {
  uploadBulkCreateTasks: UploadBulkCreateTasks;
  onGoBack: () => void;
  onConfirm: () => void;
}

export const ConfirmStep: React.FC<ConfirmStep> = ({
  uploadBulkCreateTasks,
  onConfirm = () => {},
  onGoBack = () => {},
}) => {
  const classes = useStyles({});

  const workcenterTasksImports = useGetTableData(uploadBulkCreateTasks);

  function handleConfirm() {
    onConfirm();
  }

  return (
    <Box data-testid={dataTestIds.root}>
      <Typography>Tasks to be created:</Typography>

      <TableContainer component={Box} m={1} className={classes.tableContainer}>
        <Table stickyHeader aria-label="tasks" size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeader}>Date</TableCell>
              <TableCell className={classes.tableHeader}>Workcenter</TableCell>
              <TableCell className={classes.tableHeader}>Task</TableCell>
              <TableCell className={classes.tableHeader} align="right">
                Number of tasks
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workcenterTasksImports.map(row => {
              const nodeId = `${row.plannedDate}_${row.workcenter}_${row.task}`;
              return (
                <TableRow key={nodeId} data-testid={dataTestIds.taskDetails(nodeId)}>
                  <TableCell>{getLuxonDateTime(row.plannedDate).toFormat(DateTimeFormat.DATE_ONLY)}</TableCell>
                  <TableCell>{row.workcenter}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell align="right">{row.tasks.length}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end" mt={1}>
        <Box mr={1}>
          <Button variant="contained" color="default" onClick={onGoBack}>
            Back
          </Button>
        </Box>
        <Box>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
