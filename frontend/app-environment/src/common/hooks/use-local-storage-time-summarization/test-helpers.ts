import { LOCAL_STORAGE_KEY_TIME_SUMMARIZATION } from '.';

export function clearLocalStorageTimeSummarization() {
  localStorage.removeItem(LOCAL_STORAGE_KEY_TIME_SUMMARIZATION);
}
