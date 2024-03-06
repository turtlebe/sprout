import { SourceType } from '@plentyag/core/src/types/environment';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mockNormalizedObservation, mockObservations, mockRolledUpByTimeObservations } from '../../test-helpers';

import { dataTestIdsObservationSource as dataTestIds, ObservationSource } from '.';

const [observation] = mockObservations;
const [normalizedObservation] = mockNormalizedObservation;
const [rolledUpByTimeObservation] = mockRolledUpByTimeObservations;

function renderObservationSource(observation) {
  return render(
    <MemoryRouter>
      <ObservationSource observation={observation} />
    </MemoryRouter>
  );
}

describe('ObservationSource', () => {
  it('renders for an Observation', () => {
    const { queryByTestId } = renderObservationSource(observation);

    expect(queryByTestId(dataTestIds.sourceType(SourceType.device))).toBeInTheDocument();
  });

  it('renders for a NormalizedObservation', () => {
    const { queryByTestId } = renderObservationSource(normalizedObservation);

    expect(queryByTestId(dataTestIds.sourceType(SourceType.device))).toBeInTheDocument();
  });

  it('renders for a RolledUpByTimeObservation', () => {
    const { queryByTestId } = renderObservationSource(rolledUpByTimeObservation);

    expect(queryByTestId(dataTestIds.sourceType(SourceType.other))).toBeInTheDocument();
  });
});
