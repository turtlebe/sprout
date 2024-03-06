import { get } from 'lodash';

export interface SortByDate {
  attribute: string;
  order?: 'desc' | 'asc';
}

export const sortByDate =
  ({ attribute, order = 'desc' }: SortByDate) =>
  (a, b) => {
    if (order === 'desc') {
      return -get(a, attribute).localeCompare(get(b, attribute));
    } else {
      return get(a, attribute).localeCompare(get(b, attribute));
    }
  };
