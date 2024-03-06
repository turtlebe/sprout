import { getRelativeTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import numeral from 'numeral';
import React from 'react';

import { useStyles } from './styles';

export interface AutocompleteOptionWithCount {
  label: string;
  count?: number;
  lastObservedAt?: string;
}

export const AutocompleteOptionWithCount: React.FC<AutocompleteOptionWithCount> = ({
  label,
  count,
  lastObservedAt,
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      <div>{label}</div>
      <div className={classes.info}>
        {numeral(count).format('0.0a')}
        {lastObservedAt && ` - ${getRelativeTime(DateTime.fromISO(lastObservedAt).toJSDate())}`}
      </div>
    </div>
  );
};
