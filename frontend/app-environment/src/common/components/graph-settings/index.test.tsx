import { DEFAULT_TIME_GRANULARITY } from '@plentyag/app-environment/src/common/utils/constants';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';

import { DropdownTimeGranularity, DropdownTimeSummarization } from '..';

import { dataTestIdsGraphSettings, GraphSettings } from '.';

jest.mock('../dropdown-time-summarization');
jest.mock('../dropdown-time-granularity');

const MockDropdownTimeGranularity = DropdownTimeGranularity as jest.Mock;
const MockDropdownTimeSummarization = DropdownTimeSummarization as jest.Mock;
const onTimeSummarizationChanged = jest.fn();
const onTimeGranularityChanged = jest.fn();
const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');

const dataTestIds = {
  ...dataTestIdsGraphSettings,
  timeGranularity: 'btn-time-granularity',
  timeSummarization: 'btn-time-summarization',
};

const ButtonTimeGranularity = ({ onChange }) => (
  <button data-testid={dataTestIds.timeGranularity} onClick={() => onChange(5)} />
);
const ButtonTimeSummarization = ({ onChange }) => (
  <button data-testid={dataTestIds.timeSummarization} onClick={() => onChange(TimeSummarization.median)} />
);

function expectWhenClosed(queryByTestId) {
  expect(queryByTestId(dataTestIds.open)).toBeVisible();
  expect(queryByTestId(dataTestIds.close)).not.toBeVisible();
  expect(queryByTestId(dataTestIds.timeSummarization)).not.toBeVisible();
  expect(queryByTestId(dataTestIds.timeGranularity)).not.toBeVisible();
}

describe('GraphSettings', () => {
  beforeEach(() => {
    onTimeSummarizationChanged.mockRestore();
    onTimeGranularityChanged.mockRestore();
    MockDropdownTimeGranularity.mockRestore();
    MockDropdownTimeSummarization.mockRestore();

    MockDropdownTimeGranularity.mockImplementation(ButtonTimeGranularity);
    MockDropdownTimeSummarization.mockImplementation(ButtonTimeSummarization);
  });

  it('renders as not loading and closed', () => {
    const { queryByTestId } = render(
      <GraphSettings
        isLoading={false}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        onTimeGranularityChanged={onTimeGranularityChanged}
        onTimeSummarizationChanged={onTimeSummarizationChanged}
      />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expectWhenClosed(queryByTestId);
  });

  it('renders as loading and closed', () => {
    const { queryByTestId, queryAllByTestId } = render(
      <GraphSettings
        isLoading
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        onTimeGranularityChanged={onTimeGranularityChanged}
        onTimeSummarizationChanged={onTimeSummarizationChanged}
      />
    );

    expect(queryAllByTestId(dataTestIds.loader)[0]).toBeInTheDocument();
    expect(queryAllByTestId(dataTestIds.loader)[1]).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.open)).toBeVisible();
    expect(queryByTestId(dataTestIds.close)).not.toBeVisible();
  });

  it('opens and close the settings', () => {
    const { queryByTestId } = render(
      <GraphSettings
        isLoading
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        onTimeGranularityChanged={onTimeGranularityChanged}
        onTimeSummarizationChanged={onTimeSummarizationChanged}
      />
    );

    expectWhenClosed(queryByTestId);

    queryByTestId(dataTestIds.open).click();

    expect(queryByTestId(dataTestIds.close)).toBeVisible();
    expect(queryByTestId(dataTestIds.timeSummarization)).toBeVisible();
    expect(queryByTestId(dataTestIds.timeGranularity)).toBeVisible();

    queryByTestId(dataTestIds.close).click();

    expectWhenClosed(queryByTestId);
  });

  it('opens the settings and changes the time granularity', () => {
    const { queryByTestId } = render(
      <GraphSettings
        isLoading={false}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        onTimeGranularityChanged={onTimeGranularityChanged}
        onTimeSummarizationChanged={onTimeSummarizationChanged}
      />
    );

    queryByTestId(dataTestIds.open).click();
    queryByTestId(dataTestIds.timeSummarization).click();

    expect(onTimeSummarizationChanged).toHaveBeenCalledWith(TimeSummarization.median);
    expect(onTimeGranularityChanged).not.toHaveBeenCalled();
  });

  it('opens the settings and changes the time summarization', () => {
    const { queryByTestId } = render(
      <GraphSettings
        isLoading={false}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        onTimeGranularityChanged={onTimeGranularityChanged}
        onTimeSummarizationChanged={onTimeSummarizationChanged}
      />
    );

    queryByTestId(dataTestIds.open).click();
    queryByTestId(dataTestIds.timeGranularity).click();

    expect(onTimeGranularityChanged).toHaveBeenCalledWith(5);
    expect(onTimeSummarizationChanged).not.toHaveBeenCalled();
  });

  it('renders additional content to download data', () => {
    const { queryByTestId } = render(
      <GraphSettings
        isLoading={false}
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        onTimeGranularityChanged={onTimeGranularityChanged}
        onTimeSummarizationChanged={onTimeSummarizationChanged}
        downloadIcon={<div data-testid="download-data" />}
      />
    );

    expect(queryByTestId('download-data')).toBeInTheDocument();
  });
});
