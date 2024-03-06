import { Show } from '@plentyag/brand-ui/src/components';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@plentyag/brand-ui/src/material-ui/core';
import { FarmDefWorkcenter } from '@plentyag/core/src/farm-def/types';
import React from 'react';

import { useLoadWorkcenters, useWorkcentersFeatureFlag } from '../../hooks';

const dataTestIds = {
  selectAll: 'select-workcenters-select-all',
  selectWorkcenter: (workcenterName: string) => `select-workcenters-select-${workcenterName}`,
  submit: 'select-workcenters-submit',
};
export { dataTestIds as dataTestIdsSelectWorkcentersStep };

export interface SelectWorkcentersStep {
  defaultSelectedWorkcenters?: FarmDefWorkcenter[];
  submitLabel?: string;
  onSelectedWorkcentersSubmit?: (workcenters: FarmDefWorkcenter[]) => void;
}

/**
 * This component allows the user to select from list of workcenters, callback is provided when the value(s) change.
 */
export const SelectWorkcentersStep: React.FC<SelectWorkcentersStep> = ({
  defaultSelectedWorkcenters = [],
  onSelectedWorkcentersSubmit = () => {},
  submitLabel = 'Submit',
}) => {
  const { workcenters: loadedWorkcenters, isLoading } = useLoadWorkcenters();
  const workcenters = useWorkcentersFeatureFlag(loadedWorkcenters);

  const [selectedWorkcenters, setSelectedWorkcenters] = React.useState<FarmDefWorkcenter[]>(defaultSelectedWorkcenters);

  const areAllSelected = isLoading ? false : selectedWorkcenters.length === workcenters.length;

  function isWorkcenterSelected(workcenter) {
    return Boolean(selectedWorkcenters.find(findWorkcenter => findWorkcenter.id === workcenter.id));
  }

  function handleSelectAll() {
    setSelectedWorkcenters(areAllSelected ? [] : workcenters);
  }

  function handleSelectWorkcenter(selectedWorkcenter: FarmDefWorkcenter) {
    const newSelectedWorkcenters = isWorkcenterSelected(selectedWorkcenter)
      ? workcenters.filter(workcenter => isWorkcenterSelected(workcenter) && workcenter.id !== selectedWorkcenter.id)
      : workcenters.filter(workcenter => isWorkcenterSelected(workcenter) || workcenter.id === selectedWorkcenter.id);

    setSelectedWorkcenters(newSelectedWorkcenters);
  }

  function handleSelectedWorkcentersSubmit() {
    onSelectedWorkcentersSubmit(selectedWorkcenters);
  }

  return (
    <FormControl disabled={isLoading} fullWidth>
      <FormLabel component="legend">Choose the workcenters you want to apply the uploaded file to</FormLabel>
      <Show
        when={!isLoading}
        fallback={
          <Box m={1}>
            <CircularProgress size="1rem" />
          </Box>
        }
      >
        <FormGroup style={{ flexDirection: 'row' }}>
          <Show when={workcenters.length > 1}>
            <FormControlLabel
              control={
                <Checkbox data-testid={dataTestIds.selectAll} checked={areAllSelected} onChange={handleSelectAll} />
              }
              label="All"
            />
          </Show>
          {workcenters.map(workcenter => (
            <FormControlLabel
              data-testid={dataTestIds.selectWorkcenter(workcenter.name)}
              key={workcenter.name}
              control={
                <Checkbox
                  checked={isWorkcenterSelected(workcenter)}
                  onChange={() => handleSelectWorkcenter(workcenter)}
                />
              }
              label={workcenter.displayName}
            />
          ))}
        </FormGroup>
      </Show>
      <Box display="flex" justifyContent="flex-end">
        <Button
          data-testid={dataTestIds.submit}
          disabled={selectedWorkcenters.length < 1}
          variant="contained"
          color="primary"
          onClick={handleSelectedWorkcentersSubmit}
        >
          {submitLabel}
        </Button>
      </Box>
    </FormControl>
  );
};
