import { mockAssessmentTypesRecord } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/test-helpers/mock-assessment-types';
import { dataTestIdsDialogBaseForm } from '@plentyag/brand-ui/src/components';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import { usePostRequest, usePutRequest } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as yup from 'yup';

import { useEditAssessmentTypeFormGenConfig } from '../../hooks/use-edit-assessment-type-form-gen-config';

import { EditAssessmentTypeButton } from '.';

jest.mock('../../hooks/use-edit-assessment-type-form-gen-config');
const mockUseEditAssessmentTypeFormGenConfig = useEditAssessmentTypeFormGenConfig as jest.Mock;

const defaultButtonTestId = 'default-button';
const iconButtonTestId = 'icon-button';
jest.mock('@plentyag/brand-ui/src/material-ui/core/button', () => ({
  Button: props => {
    return (
      <div data-testid={defaultButtonTestId} onClick={props.onClick}>
        {props.children}
      </div>
    );
  },
}));

jest.mock('@plentyag/brand-ui/src/material-ui/core/icon-button', () => ({
  IconButton: props => (
    <div data-testid={iconButtonTestId} onClick={props.onClick}>
      {props.children}
    </div>
  ),
}));

jest.mock('@plentyag/core/src/core-store');

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;

describe('EditAssessmentTypeButton', () => {
  const mockAssessmentType = mockAssessmentTypesRecord.largeLeaves;
  const mockOnSuccess = jest.fn();
  const mockFormGenConfig = {
    title: 'Edit Test',
    createEndpoint: '/test/create',
    updateEndpoint: '/test/edit',
    serialize: a => a,
    deserialize: a => a,
    fields: [
      {
        type: 'TextField',
        name: 'name',
        label: 'Name',
        validate: yup.string().optional(),
      },
    ],
    permissions: {
      create: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
      update: { resource: Resources.HYP_QUALITY, level: PermissionLevels.EDIT },
    },
  };

  beforeEach(() => {
    mockUseEditAssessmentTypeFormGenConfig.mockReturnValue(mockFormGenConfig);

    mockUsePostRequest.mockReturnValue({
      data: undefined,
      isLoading: false,
      makeRequest: jest.fn(),
    });

    mockUsePutRequest.mockReturnValue({
      data: undefined,
      isLoading: false,
      makeRequest: jest.fn(),
    });

    mockCurrentUser({
      username: 'bishopthesprinker',
      permissions: {
        HYP_QUALITY: 'EDIT',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderEditAssessmentTypeButton(assessmentType?) {
    return render(
      <MemoryRouter>
        <EditAssessmentTypeButton onSuccess={mockOnSuccess} assessmentType={assessmentType} />
      </MemoryRouter>
    );
  }

  it('shows button if permissions are set', () => {
    // ACT
    const { queryByTestId } = renderEditAssessmentTypeButton();

    // ASSERT
    expect(queryByTestId(defaultButtonTestId)).toBeInTheDocument();
    expect(queryByTestId(iconButtonTestId)).not.toBeInTheDocument();
  });

  it('hides button if permissions are not set', () => {
    // ARRANGE
    mockCurrentUser({
      username: 'bishopthesprinker',
      permissions: {
        HYP_QUALITY: null,
      },
    });

    // ACT
    const { queryByTestId } = renderEditAssessmentTypeButton();

    // ASSERT
    expect(queryByTestId(defaultButtonTestId)).not.toBeInTheDocument();
    expect(queryByTestId(iconButtonTestId)).not.toBeInTheDocument();
  });

  it('should show icon button if it is an update (with assessment type passed through)', () => {
    // ACT
    const { queryByTestId } = renderEditAssessmentTypeButton(mockAssessmentType);

    // ASSERT
    expect(queryByTestId(iconButtonTestId)).toBeInTheDocument();
  });

  it('shows the form', () => {
    // ARRANGE
    const { queryByTestId } = renderEditAssessmentTypeButton();

    // ACT
    queryByTestId(defaultButtonTestId).click();

    // ASSERT
    expect(queryByTestId(dataTestIdsDialogBaseForm.root)).toBeInTheDocument();
  });
});
