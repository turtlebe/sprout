type DataTestIdsType<T> = { [K in keyof T]: any } & {
  ['root']?: any;
};

export function getScopedDataTestIds<T>(dataTestIds: DataTestIdsType<T>, prefix = ''): DataTestIdsType<T> {
  const dataTestIdsWithPrefix = { ...dataTestIds };

  // add dash to prefix (if not there).
  const _prefix = prefix && !prefix.endsWith('-') ? prefix + '-' : prefix;

  // add prefix to the default values of dataTestIds.
  Object.entries(dataTestIdsWithPrefix).forEach(([k, v]) => {
    if (typeof v === 'function') {
      dataTestIdsWithPrefix[k] = (...args: any[]) => {
        const result = v(...args);

        if (typeof result === 'object') {
          // when the result is an object, it most likely means `getScopedDataTestIds` is used in a nested fashion,
          // the prefix should already be handled.
          return result;
        }

        return _prefix + result;
      };
    } else {
      dataTestIdsWithPrefix[k] = typeof v === 'object' ? v : _prefix + v;
    }
  });
  dataTestIdsWithPrefix.root = prefix || dataTestIds.root || 'root';

  return dataTestIdsWithPrefix;
}
