import { UNITS_PREFERENCE_KEY } from '.';

export function setUnitPreferenceLocalStorage(preferences) {
  localStorage.setItem(UNITS_PREFERENCE_KEY, JSON.stringify(preferences));
}

export function clearUnitPreferenceLocalStorage() {
  localStorage.removeItem(UNITS_PREFERENCE_KEY);
}

export function getUnitPreferenceLocalStorage() {
  return JSON.parse(localStorage.getItem(UNITS_PREFERENCE_KEY));
}
