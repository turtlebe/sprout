import { createMemoryHistory } from 'history';

import { updateUrlQueryParams } from '.';

describe('updateSearch', () => {
  it('adds query parameter - preserving "q"', () => {
    const history = createMemoryHistory();
    history.push('path?test=1&q=2');
    const newQueryParams = {
      location: 1,
    };
    const keepQueryParams = ['q'];

    updateUrlQueryParams({ history, newQueryParams, keepQueryParams });

    expect(history.location.search).toContain('q=2');
  });

  it('removes "location" query parameter - preserving "test" and "q"', () => {
    const history = createMemoryHistory();
    history.push('path?test=1&q=2&location=1');
    const newQueryParams = {};
    const keepQueryParams = ['test', 'q'];

    updateUrlQueryParams({ history, newQueryParams, keepQueryParams });

    expect(history.location.search).toContain('test=1');
    expect(history.location.search).toContain('q=2');
  });
});
