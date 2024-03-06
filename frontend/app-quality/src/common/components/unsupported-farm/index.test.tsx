import { GlobalSelectFarm } from '@plentyag/brand-ui/src/components/global-select-farm';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { dataTestIdsUnsupportedFarm as dataTestIds, UnsupportedFarm } from '.';

jest.mock('@plentyag/brand-ui/src/components/global-select-farm');
(GlobalSelectFarm as jest.Mock).mockImplementation(() => {
  return <div>mock global select</div>;
});

function renderUnsupportedFarm(initialPath: string) {
  const history = createMemoryHistory({ initialEntries: [initialPath] });
  const { queryByTestId } = render(
    <Router history={history}>
      <UnsupportedFarm />
    </Router>
  );

  return { queryByTestId };
}

describe('UnsupportedFarm', () => {
  it('renders for path /quality/anything', () => {
    const { queryByTestId } = renderUnsupportedFarm('/quality/anything');
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });

  it('renders for path /something-else', () => {
    const { queryByTestId } = renderUnsupportedFarm('/something-else');
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });
});
