import { AccessTime, FilterList, Label } from '@material-ui/icons';
import { ReactComponent as LeafIcon } from '@plentyag/app-production/src/maps-interactive-page/assets/leaf.svg';
import { DEFAULT_AGE_COHORT_DATE } from '@plentyag/app-production/src/maps-interactive-page/constants';
import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { Box, Divider } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { PopoverButton } from '../popover-button';

import { AgeCohortSlider } from './components/age-cohort-slider';
import { FilterButtonItem } from './components/filter-button-item';
import { SelectCrops } from './components/select-crops';
import { SelectLabels } from './components/select-labels';

const dataTestIds = getScopedDataTestIds(
  {
    button: 'button',
  },
  'filtersButton'
);

export { dataTestIds as dataTestIdsFiltersButton };

export interface FiltersButton {
  mapsState: MapsState;
}

export const FiltersButton: React.FC<FiltersButton> = ({ mapsState }) => {
  const { parameters, setParameters } = useQueryParameter();

  const areFiltersApplied =
    parameters.ageCohortDate !== DEFAULT_AGE_COHORT_DATE ||
    parameters.selectedCrops.length > 0 ||
    parameters.selectedLabels.length > 0;

  function handleClearFilters() {
    setParameters({
      ageCohortDate: DEFAULT_AGE_COHORT_DATE,
      selectedCrops: [],
      selectedLabels: [],
    });
  }

  return (
    <PopoverButton
      handleClear={areFiltersApplied ? handleClearFilters : undefined}
      buttonTitle="FILTERS"
      tooltipTitle="Filter Maps focusing on desired data points"
      icon={<FilterList />}
      button-data-testid={dataTestIds.button}
    >
      <Box width="600px">
        <FilterButtonItem title="TIME SPENT IN AREA" icon={<AccessTime fontSize="small" />}>
          <AgeCohortSlider mapsState={mapsState} />
        </FilterButtonItem>
        <Divider />
        <FilterButtonItem title="CROPS" icon={<LeafIcon width="1rem" height="1rem" />}>
          <SelectCrops mapsState={mapsState} />
        </FilterButtonItem>
        <Divider />
        <FilterButtonItem title="LABELS" icon={<Label fontSize="small" />}>
          <SelectLabels mapsState={mapsState} />
        </FilterButtonItem>
      </Box>
    </PopoverButton>
  );
};
