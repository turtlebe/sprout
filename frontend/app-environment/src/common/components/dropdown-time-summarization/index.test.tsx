import { clearLocalStorageTimeSummarization } from '@plentyag/app-environment/src/common/hooks/use-local-storage-time-summarization/test-helpers';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsDropdownTimeSummarization as dataTestIds, DropdownTimeSummarization } from '.';

const onChange = jest.fn();

describe('DropdownTimeSummarization', () => {
  beforeEach(() => {
    onChange.mockRestore();
    clearLocalStorageTimeSummarization();
  });

  it('renders the dropdown with `Median` minutes by default', () => {
    const { queryByTestId } = render(<DropdownTimeSummarization onChange={onChange} />);

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Median');
    expect(queryByTestId(dataTestIds.item(TimeSummarization.median))).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('changes the summarization to `Mean`', () => {
    const { queryByTestId } = render(<DropdownTimeSummarization onChange={onChange} />);

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.item(TimeSummarization.mean)).click();

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('Mean');
    expect(onChange).toHaveBeenCalledWith(TimeSummarization.mean);
  });

  it('does not call `onChange` then the summarization does not change', () => {
    const { queryByTestId } = render(<DropdownTimeSummarization onChange={onChange} />);

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.item(TimeSummarization.median)).click();

    expect(onChange).not.toHaveBeenCalled();
  });
});
