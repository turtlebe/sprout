import { EventTypes } from '../../common/types/interface-types';

/**
 * Checks if given lab event says there are one (or more) test results.
 * @param event Event to be checked.
 */
export function hasLabTestResult(event: LT.Event) {
  return event.type === EventTypes.blob && event.additionalProperties.labTestBlobId;
}

export function hasFormSubmissionEvent(event: LT.Event) {
  return event.type === EventTypes.submission_form && event.additionalProperties.labTestSubmissionFormId;
}
