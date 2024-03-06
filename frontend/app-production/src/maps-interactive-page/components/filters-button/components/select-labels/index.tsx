import { Autocomplete } from '@material-ui/lab';
import { useQueryParameter } from '@plentyag/app-production/src/maps-interactive-page/hooks/use-query-parameter';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { TextField } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';

const dataTestIds = {
  autocomplete: 'select-labels-autocomplete',
};

export { dataTestIds as dataTestIdsSelectLabels };

export interface SelectLabels {
  mapsState: MapsState;
}

/**
 * This component allows the user to select from a list of labels used in the
 * current map.
 */
export const SelectLabels: React.FC<SelectLabels> = ({ mapsState }) => {
  const { parameters, setParameters } = useQueryParameter();

  const allLabels = React.useMemo(() => {
    const labelsSet = new Set<string>();

    mapsState &&
      Object.values(mapsState).forEach(mapState => {
        if (mapState?.resourceState) {
          const containerLabels = mapState.resourceState.containerLabels;
          const materialLabels = mapState.resourceState.materialLabels;
          const allLabels = containerLabels.concat(materialLabels);
          allLabels.forEach(label => labelsSet.add(label));
        }
      });

    return Array.from(labelsSet).sort((a, b) => a.localeCompare(b));
  }, [mapsState]);

  return (
    <Autocomplete
      data-testid={dataTestIds.autocomplete}
      multiple
      disableCloseOnSelect
      size="small"
      options={allLabels}
      value={parameters.selectedLabels}
      onChange={(e, value) => setParameters({ selectedLabels: value })}
      renderInput={params => <TextField size="small" variant="standard" {...params} />}
    />
  );
};
