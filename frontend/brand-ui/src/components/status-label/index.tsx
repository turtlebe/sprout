import React from 'react';
import v from 'voca';

import { useStyles } from './styles';
import { Level } from './types';

export { Level as StatusLabelLevel };

const dataTestIds = {
  root: 'status-label-root',
};

export { dataTestIds as dataTestIdsStatusLabel };

export interface StatusLabel {
  level: Level;
  text: string;
}

export const StatusLabel: React.FC<StatusLabel> = ({ level, text }) => {
  const classes = useStyles({ level });
  const humanReadableText = v(text).chain().words().value().join(' ');
  return (
    <span className={classes.root} data-testid={dataTestIds.root}>
      {humanReadableText}
    </span>
  );
};
