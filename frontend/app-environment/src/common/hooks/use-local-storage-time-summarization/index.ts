import { DEFAULT_TIME_SUMMARIZATION } from '@plentyag/app-environment/src/common/utils/constants';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { useLocalStorage } from 'react-use';

export const LOCAL_STORAGE_KEY_TIME_SUMMARIZATION = 'environment-v2-time-summarization-preference';

export const useLocalStorageTimeSummarization = () => {
  return useLocalStorage<TimeSummarization>(LOCAL_STORAGE_KEY_TIME_SUMMARIZATION, DEFAULT_TIME_SUMMARIZATION);
};
