import {
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab';
import React from 'react';

const dataTestIds = {};

export { dataTestIds as dataTestIdsTimelineTask };

export interface TimelineTask {
  taskIcon: JSX.Element;
  showConnector?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
}

/**
 * This component dipslay an individual workenter plan task item. It is using
 * material-ui's Timeline to display the task, see: https://mui.com/components/timeline/
 */
export const TimelineTask: React.FC<TimelineTask> = ({
  taskIcon,
  children,
  showConnector = true,
  'data-testid': dataTestId = 'timeline-task',
}) => {
  return (
    <TimelineItem data-testid={dataTestId}>
      <TimelineOppositeContent style={{ flex: 0, padding: 0 }} />
      <TimelineSeparator>
        {taskIcon}
        {showConnector && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>{children}</TimelineContent>
    </TimelineItem>
  );
};
