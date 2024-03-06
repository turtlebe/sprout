import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { LIST_ASSESSMENT_TYPES_URL } from '../../constants';
import { mockAssessmentTypes, mockAssessmentTypesRecord } from '../../test-helpers/mock-assessment-types';

import { useFetchAssessmentTypes } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-log-axios-error-in-snackbar');
const mockUseLogAxiosErrorInSnackbar = useLogAxiosErrorInSnackbar as jest.Mock;

describe('useFetchAssessmentTypes', () => {
  let mockRevalidate;
  beforeEach(() => {
    mockRevalidate = jest.fn();

    mockUseSwrAxios.mockReturnValue({
      data: {
        data: mockAssessmentTypes,
      },
      revalidate: mockRevalidate,
      isValidating: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an array of assessment types', () => {
    // ACT
    const { result } = renderHook(() => useFetchAssessmentTypes());

    // ASSERT
    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: LIST_ASSESSMENT_TYPES_URL,
    });
    expect(result.current.allIds).toEqual([
      '101b3314-5590-4f3d-8342-776249607bc3',
      '35d07805-6c54-4894-a2dc-00b0b3d3af45',
      '7ceefd77-f073-4675-a781-7c48f42e9c24',
      'e0d8a8cb-211a-48ab-92cd-388c98dd0618',
      'b573ecdd-92c6-4f36-bd67-2587f3ca27ac',
      'dad75884-c712-4fd4-863d-57603db2c8aa',
      'b9a796c5-490f-492f-b646-0fe442da447c',
    ]);
    expect(result.current.assessmentTypes).toEqual(mockAssessmentTypes);
    expect(result.current.assessmentTypesRecord).toEqual(mockAssessmentTypesRecord);
    expect(result.current.isLoading).toBeFalsy();
  });

  it('revalidates when method is called', async () => {
    // ARRANGE
    const { result } = renderHook(() => useFetchAssessmentTypes());

    // ACT
    await result.current.revalidate();

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });

  it('handles error', () => {
    // ARRANGE
    const mockError = new Error('poop');

    mockUseSwrAxios.mockReturnValue({
      data: null,
      revalidate: mockRevalidate,
      isValidating: false,
      error: mockError,
    });

    // ACT
    renderHook(() => useFetchAssessmentTypes());

    // ASSERT
    expect(mockUseLogAxiosErrorInSnackbar).toHaveBeenCalledWith(mockError);
  });
});
