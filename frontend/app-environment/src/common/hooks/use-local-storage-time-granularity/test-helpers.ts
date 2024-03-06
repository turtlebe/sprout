import { LOCAL_STORAGE_KEY_TIME_GRANULARITY } from '.';

export function clearLocalStorageTimeGranularity() {
  localStorage.removeItem(LOCAL_STORAGE_KEY_TIME_GRANULARITY);
}
