import { PackagingLotTestStatus } from '@plentyag/core/src/types';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsTestingStatus as dataTestIds, TestStatus } from '.';

describe('TestStatus', () => {
  it('renders status (i.e. "none")', () => {
    // ACT
    const { queryByTestId } = render(<TestStatus status={PackagingLotTestStatus.NONE} />);

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.noneIcon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.current).textContent).toEqual('None');
    expect(queryByTestId(dataTestIds.overridden)).not.toBeInTheDocument();
  });

  it('renders current status "pass" when override was set to "none"', () => {
    // ACT
    const { queryByTestId } = render(
      <TestStatus status={PackagingLotTestStatus.PASS} overriddenStatus={PackagingLotTestStatus.NONE} />
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.current).textContent).toEqual('Pass');
    expect(queryByTestId(dataTestIds.passIcon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.overridden)).not.toBeInTheDocument();
  });

  it('renders new status "fail" since it was overidden (i.e. current = "pass", override = "fail")', () => {
    // ACT
    const { queryByTestId } = render(
      <TestStatus status={PackagingLotTestStatus.PASS} overriddenStatus={PackagingLotTestStatus.FAIL} />
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.failIcon)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.current).textContent).toEqual('Fail');
    expect(queryByTestId(dataTestIds.overridden).textContent).toEqual('Pass');
  });
});
