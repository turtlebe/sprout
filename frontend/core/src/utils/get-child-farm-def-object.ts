import { get } from 'lodash';

import { FarmDefObject } from '../farm-def/types';

// lodash uses dot notation to get children, FDS uses slashes
const getDottedPath = string => string.replace(/\//g, '.');

export function getChildFarmDefObject<T extends FarmDefObject | ScheduleDefinition>(
  parentObject: FarmDefObject,
  path: string
): T {
  if (!path || !parentObject) {
    return undefined;
  }

  const relativePath = path.includes(parentObject.path) ? path.replace(parentObject.path + '/', '') : path;

  return get(parentObject, getDottedPath(relativePath));
}
