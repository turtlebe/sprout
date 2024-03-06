import { mockDashboards } from '@plentyag/app-environment/src/common/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsHeaderDashboard as dataTestIds, HeaderDashboard } from '.';

const [dashboard] = mockDashboards;

mockCurrentUser();

describe('HeaderDashboard', () => {
  it('returns a loading state', () => {
    const { queryByTestId, container } = render(
      <MemoryRouter>
        <HeaderDashboard dashboard={dashboard} isLoading={true} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.loader)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.description)).not.toBeInTheDocument();
    expect(container).toHaveTextContent('--');
  });

  it('returns information about the dashboard', () => {
    const { queryByTestId, container } = render(
      <MemoryRouter>
        <HeaderDashboard dashboard={dashboard} isLoading={false} />
      </MemoryRouter>
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.description)).toHaveTextContent(dashboard.name);
    expect(container).not.toHaveTextContent('--');
    expect(container).toHaveTextContent(dashboard.id);
  });
});
