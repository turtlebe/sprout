import { mockFakeResults } from '@plentyag/app-perception/src/common/test-helpers/mocks';
import { render } from '@testing-library/react';

import { dataTestIdsTrialInfoView as dataTestIds, TrialInfoView } from './trial-info-table-view';

const renderTrialInfoView = () => {
  return render(<TrialInfoView results={mockFakeResults} onBackToSearch={jest.fn()} />);
};

describe('TrialInfoView', () => {
  it('shows the Table and tableRow based on the test results data', () => {
    const { queryByTestId } = renderTrialInfoView();
    expect(queryByTestId(dataTestIds.table)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.header)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.row('b71b78a1-2cdd-427c-beb0-0c792d0c8f06'))).toBeInTheDocument();
  });
});
