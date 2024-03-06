import { DEFAULT_AGE_COHORT_DATE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { FarmDefArea, FarmDefLine } from '@plentyag/core/src/farm-def/types';
import { DateTime } from 'luxon';
import React from 'react';

import { QueryParameters } from '../../types';

// this function is necessary since when getting new defaults
// we need to get a "now" value for selectedDate.
const getDefaultParameters = () => ({
  ageCohortDate: DEFAULT_AGE_COHORT_DATE,
  selectedCrops: [],
  selectedLabels: [],
  selectedDate: DateTime.now(),
  showSerials: false,
  showIrrigationLayer: false,
  showCommentsLayer: false,
});

export interface UseDefaultParameters {
  area?: FarmDefArea;
  line?: FarmDefLine;
}

export interface UseDefaultParametersReturn {
  defaultParameters: QueryParameters;
  handleMapsReset: () => void;
}

/**
 * This hook gets the default query parameter for the maps page.
 * The default values are reset in two cases:
 * 1. when the user navigates to a new area/line
 * 2. when the user clicks on the reset button
 * In either of these cases we need to generate new default parameters since
 * the selectedDate will be different (now).
 */
export const useDefaultParameters = ({ area, line }: UseDefaultParameters): UseDefaultParametersReturn => {
  // changes when user navigates to a new area/line
  const defaultParametersAfterMapNav = React.useMemo<QueryParameters>(() => getDefaultParameters(), [area, line]);

  // changes when user clicks on reset button
  const [defaultParametersAfterReset, setDefaultParametersAfterReset] = React.useState<QueryParameters>(
    getDefaultParameters()
  );

  function handleMapsReset() {
    setDefaultParametersAfterReset(getDefaultParameters());
  }

  // for default, pick whichever one has the newest selectedDate. this allows maps reset to update
  // the default and vice-versa.
  const defaultParameters =
    defaultParametersAfterMapNav.selectedDate > defaultParametersAfterReset.selectedDate
      ? defaultParametersAfterMapNav
      : defaultParametersAfterReset;

  return { defaultParameters, handleMapsReset };
};
