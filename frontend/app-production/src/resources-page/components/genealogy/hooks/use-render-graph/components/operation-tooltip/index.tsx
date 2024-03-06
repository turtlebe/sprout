import { getPrettyDate } from '@plentyag/app-production/src/resources-page/components/genealogy/utils';
import { Divider, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

export const MAX_OPERATIONS_TO_SHOW = 10;

export const dataTestIds = {
  header: 'header',
  bodyItem: 'body-item',
  footer: 'footer',
};

interface OperationTooltip {
  operations: ProdResources.Operation[];
}

export const OperationTooltip: React.FC<OperationTooltip> = ({ operations }) => {
  const header =
    operations.length > 1 ? (
      <Typography data-testid={dataTestIds.header}>{operations.length} Overlapping items:</Typography>
    ) : null;

  const body = operations.slice(0, MAX_OPERATIONS_TO_SHOW).map((operation, index) => {
    const userPerformingOperation = operation.username ? `${operation.username} performed on ` : '';
    return (
      <div key={index} data-testid={dataTestIds.bodyItem}>
        {operations.length > 1 && <Divider variant="fullWidth" />}
        <Typography>{operation.type}</Typography>
        <Typography variant="caption">
          {userPerformingOperation}
          {getPrettyDate(operation.endDt)}
        </Typography>
      </div>
    );
  });

  const footer = operations.length > MAX_OPERATIONS_TO_SHOW && (
    <Typography data-testid={dataTestIds.footer}>
      {operations.length - MAX_OPERATIONS_TO_SHOW} more operations not displayed.
    </Typography>
  );

  return (
    <>
      {header}
      {body}
      {footer}
    </>
  );
};
