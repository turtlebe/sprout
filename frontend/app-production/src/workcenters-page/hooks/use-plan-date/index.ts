import { useQueryParam } from '@plentyag/core/src/hooks';
import { appendQueryParams, DateTimeFormat, getLuxonDateTime } from '@plentyag/core/src/utils';
import { DateTime } from 'luxon';
import { useHistory } from 'react-router-dom';

export const DATE_QUERY_PARAM = 'planDate';

export const usePlanDate = () => {
  const queryParams = useQueryParam();
  const dateQueryParamString = queryParams.get(DATE_QUERY_PARAM);
  const history = useHistory();

  const planDate = getLuxonDateTime(dateQueryParamString || undefined).toJSDate();

  function setPlanDate(newDate: Date) {
    const currentPath = history.location.pathname;
    const newQueryParams = appendQueryParams({
      [DATE_QUERY_PARAM]: DateTime.fromJSDate(newDate).toFormat(DateTimeFormat.SQL_DATE_ONLY),
    });
    history.push(`${currentPath}${newQueryParams}`);
  }

  return {
    planDate,
    setPlanDate,
  };
};
