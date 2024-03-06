import { AlertState } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { AlertStateIcon, dataTestIdsAlertStateIcon as dataTestIds } from '.';

describe('AlertStateIcon', () => {
  it('renders an icon for AlertState.on when passing null', () => {
    const { queryByTestId } = render(<AlertStateIcon alertState={null} />);

    expect(queryByTestId(dataTestIds.on)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.off)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozed)).not.toBeInTheDocument();
  });

  it('renders an icon for AlertState.on', () => {
    const { queryByTestId } = render(<AlertStateIcon alertState={AlertState.on} />);

    expect(queryByTestId(dataTestIds.on)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.off)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozed)).not.toBeInTheDocument();
  });

  it('renders an icon for AlertState.off', () => {
    const { queryByTestId } = render(<AlertStateIcon alertState={AlertState.off} />);

    expect(queryByTestId(dataTestIds.on)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.off)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozed)).not.toBeInTheDocument();
  });

  it('renders an icon for AlertState.snoozed', () => {
    const { queryByTestId } = render(<AlertStateIcon alertState={AlertState.snoozed} />);

    expect(queryByTestId(dataTestIds.on)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.off)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.snoozed)).toBeInTheDocument();
  });
});
