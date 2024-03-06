import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTabLabelAlertEvents as dataTestIds, TabLabelAlertEvents } from '.';

describe('TabLabelAlertEvents', () => {
  it('renders a TabLabelAlertEvents with alert events', () => {
    const { queryByTestId, container } = render(<TabLabelAlertEvents hasActiveAlertEvents={true} />);

    expect(container).toHaveTextContent('Alerts');
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.warningIcon)).toBeInTheDocument();
  });

  it('renders a TabLabelAlertEvents without alert events', () => {
    const { queryByTestId, container } = render(<TabLabelAlertEvents hasActiveAlertEvents={false} />);

    expect(container).toHaveTextContent('Alerts');
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.warningIcon)).not.toBeInTheDocument();
  });
});
