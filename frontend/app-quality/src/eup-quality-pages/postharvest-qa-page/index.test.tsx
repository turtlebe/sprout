import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { dataTestIdsPostharvestQaFormPage as dataTestIds, PostharvestQaPage } from '.';

import { useFetchAssessmentTypes, useFetchPostharvestIngests } from './hooks';
import { mockAssessmentTypes, mockAssessmentTypesRecord } from './test-helpers/mock-assessment-types';
import { mockPostharvestIngestRecord } from './test-helpers/mock-postharvest-ingest';

jest.mock('./hooks/use-fetch-assessment-types');
const mockUseFetchAssessmentTypes = useFetchAssessmentTypes as jest.Mock;

jest.mock('./hooks/use-fetch-postharvest-ingests');
const mockUseFetchPostharvestIngests = useFetchPostharvestIngests as jest.Mock;

describe('PostharvestQaPage', () => {
  function renderPostharvestQaPage() {
    return render(
      <MemoryRouter>
        <PostharvestQaPage />
      </MemoryRouter>
    );
  }

  beforeEach(() => {
    mockCurrentUser();

    mockUseFetchAssessmentTypes.mockReturnValue({
      assessmentTypes: mockAssessmentTypes,
      assessmentTypesRecord: mockAssessmentTypesRecord,
      isLoading: false,
    });

    mockUseFetchPostharvestIngests.mockReturnValue({
      postharvestIngestRecord: mockPostharvestIngestRecord,
      revalidate: jest.fn(),
      isLoading: false,
    });
  });

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderPostharvestQaPage();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.displayName)).toHaveTextContent('Post Harvest QA');
  });
});
