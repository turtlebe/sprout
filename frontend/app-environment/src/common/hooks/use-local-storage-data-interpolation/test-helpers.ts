import { LOCAL_STORAGE_KEY_DATA_INTERPOLATION } from '.';

export function clearLocalStorageTimeGranularity(id: string) {
  localStorage.removeItem(`${LOCAL_STORAGE_KEY_DATA_INTERPOLATION}-${id}`);
}
