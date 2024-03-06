import { DEFAULT_AGE_COHORT_DATE } from '@plentyag/app-production/src/maps-interactive-page/constants';

import { AgeCohorSliderChange } from './types';

export const DEFAULT_ALL = { value: -1, label: 'All' };
export const DEFAULT_ALL_RECORD: AgeCohorSliderChange = {
  ...DEFAULT_ALL,
  shortLabel: 'All',
  ageCohortDate: DEFAULT_AGE_COHORT_DATE,
};
