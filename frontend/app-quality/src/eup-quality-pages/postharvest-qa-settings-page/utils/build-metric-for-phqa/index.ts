import { OBSERVATION_PATH } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/constants';
import { Metric } from '@plentyag/core/src/types/environment';

export const buildMetricForPhqa = (username: string, observationName: string, alertRules = []): Partial<Metric> => ({
  createdBy: username,
  measurementType: 'PERCENTAGE',
  observationName: observationName,
  path: OBSERVATION_PATH,
  unitConfig: {
    max: 100,
    min: 0,
  },
  alertRules,
});
