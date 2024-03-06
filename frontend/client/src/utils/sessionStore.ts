interface ValuesObject {
  [key: string]: string | null;
}

const SEPARATOR = '|';

const getSessionKey = (prefix: string, key: string) => `${prefix}${SEPARATOR}${key}`;

/* Utility function to get a sessionStorage value */
export const getSessionValue = (prefix: string, key: string): string | null =>
  sessionStorage.getItem(getSessionKey(prefix, key));

/* Utility function to set a sessionStorage value */
export const setSessionValue = (prefix: string, key: string, value: string): void =>
  sessionStorage.setItem(getSessionKey(prefix, key), value);

/* Utility to delete a stored session value */
export const deleteSessionValue = (prefix: string, key: string): void =>
  sessionStorage.removeItem(getSessionKey(prefix, key));

/* Utility function to get many sessionStorage values */
export const getManySessionValues = (prefix: string, keys: string[]): ValuesObject => {
  const values: ValuesObject = {};
  keys.forEach(key => {
    values[key] = getSessionValue(prefix, key);
  });
  return values;
};

/* Utility function to set many sessionStorage values */
export const setManySessionValues = (prefix: string, values: ValuesObject): void => {
  Object.entries(values).forEach(([key, value]) => {
    if (value !== null) {
      setSessionValue(prefix, key, value);
    }
  });
};

/* Utility function to delete many sessionStorage values */
export const deleteManySessionValues = (prefix: string, keys: string[]): void => {
  keys.forEach(key => {
    deleteSessionValue(prefix, key);
  });
};

export const getAllSessionValues = (prefix: string): ValuesObject => {
  const values: ValuesObject = {};
  const prefixWithSeparator = getSessionKey(prefix, '');
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith(prefixWithSeparator)) {
      values[key] = sessionStorage.getItem(key);
    }
  });
  return values;
};
