import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { TimelineDot } from '@material-ui/lab';
import { Box, Button, Collapse, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { TimelineTask } from '../timeline-task';

import { useStyles } from './styles';

const dataTestIds = {
  toggleExpandedButton: 'collapsable-timeline-tasks-toggle-button',
  timelineTaskItems: 'collapsable-timeline-tasks-children',
  headerTaskItem: 'collapsable-timeline-header-task-item',
};

export { dataTestIds as dataTestIdsCollapsableTimelineTasks };

export interface CollapsableTimelineTasks {
  title: string;
  defaultTimelineIconColor: string;
  children?: React.ReactNode; // array of TimelineTask
  showHeaderConnectorWhenCollapsed?: boolean;
  showHeaderConnector?: boolean;
}

/**
 * This component displays a collapsable list of workcenter plan tasks.
 */
export const CollapsableTimelineTasks: React.FC<CollapsableTimelineTasks> = ({
  title,
  defaultTimelineIconColor,
  children,
  showHeaderConnectorWhenCollapsed = true,
  showHeaderConnector = true,
}) => {
  const classes = useStyles({});

  const [areTasksExpanded, setTasksExpanded] = React.useState(true);

  const showConnector = showHeaderConnector && areTasksExpanded ? true : showHeaderConnectorWhenCollapsed;

  return (
    <>
      <Button
        data-testid={dataTestIds.toggleExpandedButton}
        style={{ padding: 0, justifyContent: 'left' }}
        onClick={() => setTasksExpanded(!areTasksExpanded)}
      >
        <TimelineTask
          showConnector={showConnector}
          taskIcon={
            areTasksExpanded ? (
              <TimelineDot style={{ backgroundColor: defaultTimelineIconColor }}>
                <ExpandLess />
              </TimelineDot>
            ) : (
              <TimelineDot style={{ backgroundColor: defaultTimelineIconColor }}>
                <ExpandMore />
              </TimelineDot>
            )
          }
        >
          <Typography data-testid={dataTestIds.headerTaskItem} className={classes.title}>
            {title}
          </Typography>
        </TimelineTask>
      </Button>
      <Collapse in={areTasksExpanded}>
        <Box data-testid={dataTestIds.timelineTaskItems}>{children}</Box>
      </Collapse>
    </>
  );
};
