import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { SummaryStatus } from '../../../types';

import { dataTestIdSummaryStatusIcon as dataTestIds, SummaryStatusIcon } from '.';

describe('SummaryStatusIcon', () => {
  function expectStatusColorToBe(status: SummaryStatus, color: string) {
    const { queryByTestId } = render(<SummaryStatusIcon summaryStatus={status} />);
    expect(queryByTestId(dataTestIds.iconContainer)).toHaveStyle(`color: ${color}`);
  }

  it('shows RUNNING status color as: green', () => {
    expectStatusColorToBe(SummaryStatus.RUNNING, 'green');
  });

  it('shows SUCCESS status color as: navy', () => {
    expectStatusColorToBe(SummaryStatus.SUCCESS, 'navy');
  });

  it('shows FAILURE status color as: red', () => {
    expectStatusColorToBe(SummaryStatus.FAILURE, 'red');
  });

  it('shows CANCELED status color as: yellow', () => {
    expectStatusColorToBe(SummaryStatus.CANCELED, 'gold');
  });

  it('shows undefined status color as: grey', () => {
    const consoleError = mockConsoleError();
    expectStatusColorToBe(undefined, 'grey');
    expect(consoleError).toHaveBeenCalled();
  });
});
