import {
  dataInterpolations,
  DEFAULT_DATA_INTERPOLATION,
  DEFAULT_TIME_GRANULARITY,
} from '@plentyag/app-environment/src/common/utils/constants';
import { changeTextField, getInputByName } from '@plentyag/brand-ui/src/test-helpers';
import { DataInterpolationType } from '@plentyag/core/src/types/environment';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { DropdownTimeGranularity } from '..';

import { dataTestIdsGraphSettingsNonNumerical, GraphSettingsNonNumerical } from '.';

jest.mock('../dropdown-time-granularity');

const MockDropdownTimeGranularity = DropdownTimeGranularity as jest.Mock;
const onTimeGranularityChanged = jest.fn();
const onDataInterpolationChanged = jest.fn();
const onValueAttributeChange = jest.fn();
const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');

const dataTestIds = {
  ...dataTestIdsGraphSettingsNonNumerical,
  timeGranularity: 'btn-time-granularity',
};

const ButtonTimeGranularity = ({ onChange }) => (
  <button data-testid={dataTestIds.timeGranularity} onClick={() => onChange(5)} />
);

function expectWhenClosed(queryByTestId) {
  expect(queryByTestId(dataTestIds.open)).toBeVisible();
  expect(queryByTestId(dataTestIds.close)).not.toBeVisible();
  expect(queryByTestId(dataTestIds.timeGranularity)).not.toBeVisible();
}

describe('GraphSettingsNonNumerical', () => {
  beforeEach(() => {
    onTimeGranularityChanged.mockRestore();
    onDataInterpolationChanged.mockRestore();
    onValueAttributeChange.mockRestore();
    MockDropdownTimeGranularity.mockRestore();
    MockDropdownTimeGranularity.mockImplementation(ButtonTimeGranularity);
  });

  it('renders as not loading and closed', () => {
    const { queryByTestId } = render(
      <GraphSettingsNonNumerical
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        dataInterpolation={DEFAULT_DATA_INTERPOLATION}
        isLoading={false}
        onTimeGranularityChange={onTimeGranularityChanged}
      />
    );

    expect(queryByTestId(dataTestIds.loader)).not.toBeInTheDocument();
    expectWhenClosed(queryByTestId);
  });

  it('renders as loading and closed', () => {
    const { queryByTestId, queryAllByTestId } = render(
      <GraphSettingsNonNumerical
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        dataInterpolation={DEFAULT_DATA_INTERPOLATION}
        isLoading
        onTimeGranularityChange={onTimeGranularityChanged}
      />
    );

    expect(queryAllByTestId(dataTestIds.loader)[0]).toBeInTheDocument();
    expect(queryAllByTestId(dataTestIds.loader)[1]).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.open)).toBeVisible();
    expect(queryByTestId(dataTestIds.close)).not.toBeVisible();
  });

  it('opens and close the settings', () => {
    const { queryByTestId } = render(
      <GraphSettingsNonNumerical
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        dataInterpolation={DEFAULT_DATA_INTERPOLATION}
        isLoading
        onTimeGranularityChange={onTimeGranularityChanged}
      />
    );

    expectWhenClosed(queryByTestId);

    queryByTestId(dataTestIds.open).click();

    expect(queryByTestId(dataTestIds.close)).toBeVisible();
    expect(queryByTestId(dataTestIds.timeGranularity)).toBeVisible();

    queryByTestId(dataTestIds.close).click();

    expectWhenClosed(queryByTestId);
  });

  it('opens the settings and changes the time granularity', () => {
    const { queryByTestId } = render(
      <GraphSettingsNonNumerical
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        dataInterpolation={DEFAULT_DATA_INTERPOLATION}
        isLoading={false}
        onTimeGranularityChange={onTimeGranularityChanged}
      />
    );

    queryByTestId(dataTestIds.open).click();
    queryByTestId(dataTestIds.timeGranularity).click();

    expect(onTimeGranularityChanged).toHaveBeenCalledWith(5);
  });

  it('opens the settings and changes the data interpolation', () => {
    const { queryByTestId } = render(
      <GraphSettingsNonNumerical
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        dataInterpolation={DEFAULT_DATA_INTERPOLATION}
        isLoading={false}
        onTimeGranularityChange={onTimeGranularityChanged}
        onDataInterpolationChange={onDataInterpolationChanged}
      />
    );

    queryByTestId(dataTestIds.open).click();
    queryByTestId(dataTestIds.dataInterpolation).click();
    queryByTestId(dataTestIds.dataInterpolationStep(DataInterpolationType.step)).click();

    expect(onDataInterpolationChanged).toHaveBeenCalledWith(dataInterpolations[1]);
  });

  it('opens the settings and changes the advanced value', () => {
    const valueAttribute = 'appBuild';
    const newValueAttribute = 'expBoardSerial';
    const { queryByTestId } = render(
      <GraphSettingsNonNumerical
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        dataInterpolation={DEFAULT_DATA_INTERPOLATION}
        isLoading={false}
        valueAttribute={valueAttribute}
        onTimeGranularityChange={onTimeGranularityChanged}
        onValueAttributeChange={onValueAttributeChange}
      />
    );

    queryByTestId(dataTestIds.open).click();
    expect(getInputByName(dataTestIds.advancedValue)).toHaveValue(valueAttribute);
    expect(onValueAttributeChange).not.toHaveBeenCalled();

    changeTextField(dataTestIds.advancedValue, newValueAttribute);

    expect(getInputByName(dataTestIds.advancedValue)).toHaveValue(newValueAttribute);
    expect(onValueAttributeChange).not.toHaveBeenCalled();

    fireEvent.keyDown(getInputByName(dataTestIds.advancedValue), { key: 'Enter', code: 'Enter' });

    expect(onValueAttributeChange).toHaveBeenCalledWith(newValueAttribute);
  });

  it('renders additional content to download data', () => {
    const { queryByTestId } = render(
      <GraphSettingsNonNumerical
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        timeGranularity={DEFAULT_TIME_GRANULARITY}
        dataInterpolation={DEFAULT_DATA_INTERPOLATION}
        isLoading={false}
        onTimeGranularityChange={onTimeGranularityChanged}
        downloadIcon={<div data-testid="download-data" />}
      />
    );

    expect(queryByTestId('download-data')).toBeInTheDocument();
  });
});
