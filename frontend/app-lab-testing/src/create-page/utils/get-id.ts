import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';

// generates an internal id used when creating new lab test samples, so formik
// has a unique id for each row. the actual sample id is created by backend
// after submitting result.
export function getId() {
  return uuidv4();
}
