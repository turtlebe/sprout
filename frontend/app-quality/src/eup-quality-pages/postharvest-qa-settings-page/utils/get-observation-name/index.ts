import { capitalize } from 'voca';

export const OBSERVATION_FAIL_SUFFIX = 'FailPercentage';

export const getObservationFailName = (assessmentTypeName: string) => {
  return `${capitalize(assessmentTypeName)}${OBSERVATION_FAIL_SUFFIX}`;
};
