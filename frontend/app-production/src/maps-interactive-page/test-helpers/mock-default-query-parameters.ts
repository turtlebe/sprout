import { DEFAULT_AGE_COHORT_DATE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { DateTime } from 'luxon';

import { QueryParameters } from '../types';

export const mockDefaultQueryParameters: QueryParameters = {
  selectedDate: DateTime.now(),
  ageCohortDate: DEFAULT_AGE_COHORT_DATE,
  selectedCrops: [],
  selectedLabels: [],
  showSerials: false,
  showIrrigationLayer: false,
  showCommentsLayer: false,
};
