import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { Summary } from '../../types';

import { SummaryStatusIcon } from './components';
import { useStyles } from './styles';

const dataTestIds = {
  listRoot: 'summary-view-list-root',
  summaryText: 'summary-view-summary-text',
  singleLineSummary: 'summary-view-single-line-summary',
};

export { dataTestIds as dataTestIdsSummary };

export const SummaryView: React.FC<{ summary: Summary }> = ({ summary }) => {
  const classes = useStyles({});

  if (!summary || summary.length === 0) {
    return null;
  }

  return summary.length === 1 ? (
    <Typography data-testid={dataTestIds.singleLineSummary} variant="subtitle2">
      Summary: <SummaryStatusIcon summaryStatus={summary[0].status} /> {summary[0].description}
    </Typography>
  ) : (
    <>
      <Typography variant="subtitle2">Summary:</Typography>
      <List data-testid={dataTestIds.listRoot} dense disablePadding>
        {summary.map(summaryEntry => {
          const message = summaryEntry.description;
          return (
            <ListItem key={message}>
              <ListItemIcon classes={{ root: classes.listItemRoot }}>
                <SummaryStatusIcon summaryStatus={summaryEntry.status} />
              </ListItemIcon>
              <ListItemText data-testid={dataTestIds.summaryText} primary={message} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
