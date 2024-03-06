import { Level } from '@plentyag/brand-ui/src/components/status-label/types';

import { PostharvestIngest } from '../../types';

/**
 * Simple method to just return the Post harvest Ingest status
 * @param { record: PostharvestIngest} obj
 * @returns status
 */
export const getIngestStatus = (record: PostharvestIngest): Level => {
  let statusLevel = Level.PROGRESSING;
  if (record?.status === 'PASS') {
    statusLevel = Level.PASSED;
  } else if (record?.status === 'FAIL') {
    statusLevel = Level.FAILED;
  }
  return statusLevel;
};
