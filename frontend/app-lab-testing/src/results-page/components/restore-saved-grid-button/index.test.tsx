import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { dataTestIds, RestoreSavedGridButton } from '.';

describe('RestoreSavedGridButton', () => {
  it('removes query parameters when clicked', () => {
    const queryParams = '?param1=xyz&param2=abc';
    const path = `/lab-testing${queryParams}`;
    const history = createMemoryHistory({ initialEntries: [path] });

    const wrapper = ({ children }) => <Router history={history}>{children}</Router>;

    const { getByTestId } = render(<RestoreSavedGridButton />, { wrapper });

    expect(history.location.search).toBe(queryParams);

    getByTestId(dataTestIds.button).click();

    expect(history.location.search).toBe('');
  });
});
