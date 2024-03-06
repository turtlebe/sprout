import { AgeCohortDate } from '@plentyag/app-production/src/maps-interactive-page/types';

export interface AgeCohorSliderChange {
  ageCohortDate?: AgeCohortDate;
  value: number;
  shortLabel: string;
  label: string;
}
