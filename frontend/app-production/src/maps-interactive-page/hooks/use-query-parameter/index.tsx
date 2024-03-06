import { DEFAULT_AGE_COHORT_DATE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { createQueryParameterContext } from '@plentyag/core/src/utils/create-query-parameter-context';
import { DateTime } from 'luxon';
import { ArrayParam, BooleanParam, QueryParamConfigMap } from 'serialize-query-params';

import { AgeCohortDate, QueryParameters } from '../../types';

const queryParamConfigMap: QueryParamConfigMap = {
  ageCohortDate: {
    encode: (value: AgeCohortDate) => {
      if (value === DEFAULT_AGE_COHORT_DATE) {
        return value.toString();
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      return undefined;
    },
    decode: (value: string) => {
      if (value === DEFAULT_AGE_COHORT_DATE) {
        return DEFAULT_AGE_COHORT_DATE;
      }
      if (value) {
        const date = new Date(value);
        if (date.toString() !== 'Invalid Date') {
          return date;
        }
      }
      return undefined;
    },
  },
  selectedCrops: ArrayParam,
  selectedLabels: ArrayParam,
  selectedDate: {
    encode: (value: DateTime) => {
      if (value instanceof DateTime) {
        return value.toUTC().toISO();
      }
      return undefined;
    },
    decode: (value: string) => {
      if (value) {
        const date = DateTime.fromISO(value);
        if (date.isValid) {
          return date;
        }
      }
      return undefined;
    },
  },
  showSerials: BooleanParam,
  showIrrigationLayer: BooleanParam,
  showCommentsLayer: BooleanParam,
};

export const { QueryParameterProvider, useQueryParameter } =
  createQueryParameterContext<QueryParameters>(queryParamConfigMap);
