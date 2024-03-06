import { DEFAULT_TIME_GRANULARITY, timeGranularities } from '@plentyag/app-environment/src/common/utils/constants';
import { render } from '@testing-library/react';
import React from 'react';

import { clearLocalStorageTimeGranularity } from '../../hooks/use-local-storage-time-granularity/test-helpers';

import { dataTestIdsDropdownTimeGranularity as dataTestIds, DropdownTimeGranularity } from '.';

const onChange = jest.fn();
const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');

describe('DropdownTimeGranularity', () => {
  beforeEach(() => {
    onChange.mockRestore();
    clearLocalStorageTimeGranularity();
  });

  it('renders the dropdown with 5 minutes by default', () => {
    const { queryByTestId } = render(
      <DropdownTimeGranularity
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        timeGranularities={timeGranularities}
        onChange={onChange}
      />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('5 minutes');
    expect(queryByTestId(dataTestIds.item(timeGranularities[1]))).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('re-renders the dropdown with 15 minutes ', () => {
    const { queryByTestId, rerender } = render(
      <DropdownTimeGranularity
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        timeGranularities={timeGranularities}
        onChange={onChange}
      />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('5 minutes');
    expect(queryByTestId(dataTestIds.item(timeGranularities[1]))).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <DropdownTimeGranularity
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={timeGranularities.find(t => t.value === 15)}
        timeGranularities={timeGranularities}
        onChange={onChange}
      />
    );

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('15 minutes');
    expect(queryByTestId(dataTestIds.item(timeGranularities[2]))).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('changes the granularity to 15 minutes', () => {
    const { queryByTestId } = render(
      <DropdownTimeGranularity
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        timeGranularities={timeGranularities}
        onChange={onChange}
      />
    );

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.item(timeGranularities[2])).click();

    expect(queryByTestId(dataTestIds.root)).toHaveTextContent('15 minutes');
    expect(onChange).toHaveBeenCalledWith(timeGranularities[2]);
  });

  it('does not call `onChange` then the granularity does not change', () => {
    const { queryByTestId } = render(
      <DropdownTimeGranularity
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        timeGranularities={timeGranularities}
        onChange={onChange}
      />
    );

    queryByTestId(dataTestIds.root).click();
    queryByTestId(dataTestIds.item(timeGranularities[1])).click();

    expect(onChange).not.toHaveBeenCalled();
  });
});
