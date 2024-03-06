export const naturalSortCompareFunction = (x: string | undefined, y: string | undefined) =>
  (x || '').localeCompare(y || '', undefined, { sensitivity: 'base', numeric: true });

export const naturalSortObjects = (objs: object[], key: string): object[] =>
  [...objs].sort((x: object, y: object): number => naturalSortCompareFunction((x as any)[key], (y as any)[key]));

export * from './handle-redirect';
export * from './get-farm-path-from-url';
export * from './set-license-keys';
