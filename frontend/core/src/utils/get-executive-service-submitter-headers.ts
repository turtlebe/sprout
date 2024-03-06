import { CoreState } from '@plentyag/core/src/core-store/types';

import { isIgnition } from '.';

export const SUBMISSION_METHOD_DEFAULT = 'FarmOS UI';
export const SUBMISSION_METHOD_IGNITION_CONTEXT = 'FarmOS UI embedded in Ignition';

export function getExecutiveServiceSubmitterHeaders(state: CoreState) {
  return {
    submitter: state?.currentUser?.username || '',
    submission_method: isIgnition() ? SUBMISSION_METHOD_IGNITION_CONTEXT : SUBMISSION_METHOD_DEFAULT,
  };
}
