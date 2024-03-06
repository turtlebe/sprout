import { LOCAL_STORAGE_KEY, LocalStorageState } from '.';

export function setDashboardGraphStateLocalStorage(state: LocalStorageState) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export function clearDashboardGraphStateLocalStorage() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function getDashboardGraphStateLocalStorage() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
}
