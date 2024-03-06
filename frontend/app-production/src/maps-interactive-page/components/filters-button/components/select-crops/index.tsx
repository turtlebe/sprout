import { Autocomplete } from '@material-ui/lab';
import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { getCropsInResource } from '@plentyag/app-production/src/maps-interactive-page/utils';
import { TextField } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  autocomplete: 'select-crops-autocomplete',
};

export { dataTestIds as dataTestIdsSelectCrops };

export interface SelectCrops {
  mapsState: MapsState;
}

/**
 * This component allows the user to select from a list of all crops in the current map.
 * The selected crops is then used to show containers with reduced opacity
 * that do not match items in the selected crops list.
 */
export const SelectCrops: React.FC<SelectCrops> = ({ mapsState }) => {
  const { parameters, setParameters } = useQueryParameter();

  const allCrops = React.useMemo(() => {
    const cropsSet = new Set<string>();

    mapsState &&
      Object.values(mapsState).forEach(mapState => {
        if (mapState?.resourceState) {
          const crops = getCropsInResource(mapState.resourceState);
          crops.forEach(crop => cropsSet.add(crop));
        }
      });

    return Array.from(cropsSet).sort((a, b) => a.localeCompare(b));
  }, [mapsState]);

  return (
    <Autocomplete
      data-testid={dataTestIds.autocomplete}
      multiple
      disableCloseOnSelect
      size="small"
      options={allCrops}
      value={parameters.selectedCrops}
      onChange={(e, value) => setParameters({ selectedCrops: value })}
      renderInput={params => <TextField size="small" variant="standard" {...params} />}
    />
  );
};
