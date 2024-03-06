import { Tooltip } from '@plentyag/brand-ui/src/material-ui/core';
import { truncate } from 'lodash';
import React from 'react';

const dataTestIds = {
  tooltip: 'truncated-tooltip',
};

export { dataTestIds as dataTestIdsTruncated };

export interface Truncated {
  text: string;
  length: number;
}

export const Truncated: React.FC<Truncated> = ({ text, length }) => {
  if (!text) {
    return null;
  }

  if (text.length > length) {
    return (
      <Tooltip title={text} data-testid={dataTestIds.tooltip}>
        <span>{truncate(text, { length })}</span>
      </Tooltip>
    );
  }

  return <>{text}</>;
};
