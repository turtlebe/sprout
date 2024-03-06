import { mockRolledUpByTimeObservations } from '@plentyag/app-environment/src/common/test-helpers';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { SourceType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsMetricSource as dataTestIds, MetricSource } from '.';

const [observation] = mockRolledUpByTimeObservations;

const observationFromDevice = { ...observation, deviceId: 'device-id' };
const observationFromIgnition = { ...observation, tagPath: 'tag-path' };
const observationFromDos = { ...observation, clientId: 'derived_observation_service' };
const observationFromOther = { ...observation, clientId: 'unknown' };

function renderMetricSource(observation) {
  return render(
    <MemoryRouter>
      <MetricSource observation={observation} />
    </MemoryRouter>
  );
}

describe('MetricSource', () => {
  it('renders a Device source', () => {
    const { queryByTestId } = renderMetricSource(observationFromDevice);

    expect(queryByTestId(dataTestIds.sourceType(SourceType.device))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(observationFromDevice.deviceId);
    expect(queryByTestId(dataTestIds.link).getAttribute('href')).toBe(PATHS.devicePage(observationFromDevice.deviceId));
  });

  it('renders an Ignition source', () => {
    const { queryByTestId } = renderMetricSource(observationFromIgnition);

    expect(queryByTestId(dataTestIds.sourceType(SourceType.ignition))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(observationFromIgnition.tagPath);
    expect(queryByTestId(dataTestIds.link).getAttribute('href')).toBe(
      PATHS.ignitionTagsPage(observationFromIgnition.tagPath)
    );
  });

  it('renders a Derived source', () => {
    const { queryByTestId } = renderMetricSource(observationFromDos);

    expect(queryByTestId(dataTestIds.sourceType(SourceType.derived))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(observationFromDos.observationName);
    expect(queryByTestId(dataTestIds.link).getAttribute('href')).toBe(
      PATHS.derivedObservationsDefinitionsPage(observationFromDos.observationName)
    );
  });

  it('renders an "Other" source', () => {
    const { queryByTestId } = renderMetricSource(observationFromOther);

    expect(queryByTestId(dataTestIds.sourceType(SourceType.other))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.root)).toHaveTextContent(observationFromOther.clientId);
    expect(queryByTestId(dataTestIds.link)).not.toBeInTheDocument();
  });
});
