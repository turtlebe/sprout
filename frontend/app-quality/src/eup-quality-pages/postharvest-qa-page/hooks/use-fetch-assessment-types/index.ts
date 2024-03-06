import { useLogAxiosErrorInSnackbar, useSwrAxios } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { orderBy } from 'lodash';
import { useMemo } from 'react';

import { LIST_ASSESSMENT_TYPES_URL } from '../../constants';
import { AssessmentTypes } from '../../types';

export interface UseFetchAssessmentTypesReturn {
  allIds: string[];
  assessmentTypes: AssessmentTypes[];
  assessmentTypesRecord: Record<string, AssessmentTypes>;
  revalidate: () => Promise<boolean>;
  isLoading: boolean;
}

export const useFetchAssessmentTypes = (): UseFetchAssessmentTypesReturn => {
  const {
    data,
    revalidate,
    isValidating: isLoading,
    error,
  } = useSwrAxios<PaginatedList<AssessmentTypes>>({
    url: LIST_ASSESSMENT_TYPES_URL,
  });

  useLogAxiosErrorInSnackbar(error);

  const assessmentTypes = orderBy(data?.data ?? [], 'uiOrder', 'asc');

  // Create record index and collect all IDs
  const { assessmentTypesRecord, allIds } = useMemo(
    () =>
      assessmentTypes.reduce(
        (acc, assessmentType) => {
          acc.assessmentTypesRecord[assessmentType.name] = assessmentType;
          acc.allIds.push(assessmentType.id);
          return acc;
        },
        { assessmentTypesRecord: {}, allIds: [] }
      ),
    [assessmentTypes]
  );

  return {
    allIds,
    assessmentTypesRecord,
    assessmentTypes,
    revalidate,
    isLoading,
  };
};
