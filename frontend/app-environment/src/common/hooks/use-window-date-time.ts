import { useQueryParam } from '@plentyag/core/src/hooks';
import moment from 'moment';
import React from 'react';

export interface UseWindowDateTimeReturn {
  startDateTime: Date;
  endDateTime: Date;
  setStartDateTime: React.Dispatch<React.SetStateAction<Date>>;
  setEndDateTime: React.Dispatch<React.SetStateAction<Date>>;
}

export const useWindowDateTime = (): UseWindowDateTimeReturn => {
  const queryParams = useQueryParam();

  const [startDateTime, setStartDateTime] = React.useState(
    queryParams.has('startDateTime')
      ? moment(queryParams.get('startDateTime')).toDate()
      : moment().subtract(1, 'day').startOf('minute').toDate()
  );
  const [endDateTime, setEndDateTime] = React.useState(
    queryParams.has('endDateTime')
      ? moment(queryParams.get('endDateTime')).toDate()
      : moment().startOf('minute').toDate()
  );

  return {
    startDateTime,
    endDateTime,
    setStartDateTime,
    setEndDateTime,
  };
};
