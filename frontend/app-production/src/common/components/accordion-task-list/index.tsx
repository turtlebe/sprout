import { ExpandMore } from '@material-ui/icons';
import { Show } from '@plentyag/brand-ui/src/components';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { DurativeTaskState } from '../../types';

const dataTestIds = {
  root: 'accordion-task-list-root',
  list: 'accordion-task-list-list',
  progress: 'accordion-task-list-progress',
  emptyListMessage: 'accordion-task-list-empty-list-message',
};

export { dataTestIds as dataTestIdsAccordionTaskList };

export const EMPTY_LIST_MESSAGE = 'Task list is empty';
export const LOADING_MESSAGE = 'Loading...';

export interface AccordionTaskList {
  isLoading: boolean;
  isTaskListDefaultExpanded?: boolean;
  title: React.ReactNode;
  taskIcon: JSX.Element;
  tasks: DurativeTaskState[];
  renderTaskListItem: (task: DurativeTaskState) => JSX.Element;
  onAccordionChange?: (expanded: boolean) => void;
}

import { useStyles } from './styles';

export const AccordionTaskList: React.FC<AccordionTaskList> = ({
  isLoading,
  isTaskListDefaultExpanded = false,
  title,
  onAccordionChange,
  taskIcon,
  tasks,
  renderTaskListItem,
}) => {
  const classes = useStyles({});
  const progress = isLoading ? <CircularProgress data-testid={dataTestIds.progress} size="1rem" /> : null;
  return (
    <Accordion
      style={{ backgroundColor: 'inherit' }}
      defaultExpanded={isTaskListDefaultExpanded}
      elevation={5}
      data-testid={dataTestIds.root}
      TransitionProps={{ unmountOnExit: true }}
      onChange={(_, expanded: boolean) => onAccordionChange && onAccordionChange(expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMore />}>
        {title}
        {progress}
      </AccordionSummary>
      <AccordionDetails>
        {tasks?.length > 0 ? (
          <List data-testid={dataTestIds.list} dense disablePadding>
            {tasks.map(task => {
              return (
                <ListItem key={task.taskInstance.id}>
                  <ListItemIcon className={classes.listItemRoot}>{taskIcon}</ListItemIcon>
                  <ListItemText primary={renderTaskListItem(task)} />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography data-testid={dataTestIds.emptyListMessage} className={classes.italicTypography}>
            <Show when={isLoading} fallback={<>{EMPTY_LIST_MESSAGE}</>}>
              {LOADING_MESSAGE}
            </Show>
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
