import { render } from '@testing-library/react';
import { get, set } from 'lodash';
import React from 'react';

import { dataTestIdsEnvironmentBadge as dataTestIds, envContextPath, EnvironmentBadge } from '.';

describe('EnvironmentBadge', () => {
  let origEnvContextValue;

  beforeEach(() => {
    origEnvContextValue = get(window, envContextPath, '');
  });

  afterEach(() => {
    if (origEnvContextValue) {
      set(window, envContextPath, origEnvContextValue);
    }
  });

  it('shows a green env badge when user has developer role and env is dev', () => {
    set(window, envContextPath, 'dev');
    const { queryByTestId } = render(<EnvironmentBadge isDeveloper />);

    expect(queryByTestId(dataTestIds.chip)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.chip)).toHaveStyle({ backgroundColor: 'green' });
  });

  it('shows a red env badge when user has developer role and env is prod', () => {
    set(window, envContextPath, 'prod');
    const { queryByTestId } = render(<EnvironmentBadge isDeveloper />);

    expect(queryByTestId(dataTestIds.chip)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.chip)).toHaveStyle({ backgroundColor: 'red' });
  });

  it('does not show env badge if user does not have developer role', () => {
    set(window, envContextPath, 'dev');

    const { queryByTestId } = render(<EnvironmentBadge isDeveloper={false} />);

    expect(queryByTestId(dataTestIds.chip)).not.toBeInTheDocument();
  });

  it('does not show env badge if there is no env value', () => {
    set(window, envContextPath, '');

    const { queryByTestId } = render(<EnvironmentBadge isDeveloper />);

    expect(queryByTestId(dataTestIds.chip)).not.toBeInTheDocument();
  });
});
