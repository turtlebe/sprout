import { ExpandMore, InfoOutlined } from '@material-ui/icons';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tooltip,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

import { useStyles } from './styles';

const dataTestIds = {
  accordion: 'resource-card-item-accordion',
  item: 'resource-card-item-content',
  tooltipIcon: 'resource-card-item-tooltip',
};

export { dataTestIds as dataTestIdsCardItem };

export interface CardItem {
  name: string;
  tooltip?: React.ReactNode;
  'data-testid'?: string;
}

export const CardItem: React.FC<CardItem> = ({ name, tooltip, children, 'data-testid': dataTestId }) => {
  const classes = useStyles({});
  const title = (
    <>
      <Typography className={classes.header} display="inline" variant="subtitle2">
        {name}
      </Typography>
      {tooltip && (
        <Tooltip arrow title={tooltip}>
          <InfoOutlined data-testid={dataTestIds.tooltipIcon} className={classes.tooltipIcon} />
        </Tooltip>
      )}
    </>
  );

  const childrenCount = React.Children.count(children);

  if (!childrenCount) {
    return null;
  }

  if (childrenCount > 1) {
    return (
      <Accordion data-testid={dataTestId ?? dataTestIds.accordion}>
        <AccordionSummary expandIcon={<ExpandMore />}>{title}</AccordionSummary>
        <AccordionDetails className={classes.muiAccordionDetails}>{children}</AccordionDetails>
      </Accordion>
    );
  }

  return (
    <Box data-testid={dataTestId ?? dataTestIds.item} key={name} my={1}>
      {title}
      {children}
    </Box>
  );
};
