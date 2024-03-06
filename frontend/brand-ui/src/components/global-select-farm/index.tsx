import {
  Box,
  CircularProgress,
  MenuItem,
  OutlinedTextFieldProps,
  TextField,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { useUpdateCurrentFarmDefPath } from '@plentyag/core/src/hooks';
import { ValueLabel } from '@plentyag/core/src/types';
import { getShortenedPath } from '@plentyag/core/src/utils';
import { sortBy } from 'lodash';
import React from 'react';

const dataTestIds = {
  root: 'global-select-farm-site-root',
  progress: 'global-select-update-in-progress',
};

export { dataTestIds as dataTestIdsGlobalSelectFarm };

/**
 * This controls presents a selectable list of farms (from farm def) that user is
 * allowed to access. This list comes from user store value: "allowedFarmDefPaths".
 * The default selection comes from user store value: "currentFarmDefPath".
 */
export const GlobalSelectFarm: React.FC = () => {
  const [{ currentUser }] = useCoreStore();
  const currentFarmDefPath = currentUser.currentFarmDefPath;

  const { makeUpdate, isUpdating } = useUpdateCurrentFarmDefPath();

  const options = currentUser.allowedFarmDefPaths.map<ValueLabel>(path => ({
    value: path,
    label: getShortenedPath(path),
  }));
  const sortedOptions = sortBy(options, ['label']);

  const handleChange: OutlinedTextFieldProps['onChange'] = event => {
    const updatedCurrentFarmDefPath = event.target.value;
    if (updatedCurrentFarmDefPath) {
      makeUpdate(updatedCurrentFarmDefPath);
    }
  };

  return (
    <TextField
      data-testid={dataTestIds.root}
      fullWidth
      select
      label="Select global site/farm"
      value={currentFarmDefPath || ''}
      variant="outlined"
      onChange={handleChange}
      disabled={isUpdating}
      InputProps={
        isUpdating
          ? {
              startAdornment: (
                <Box mr={0.5}>
                  <CircularProgress data-testid={dataTestIds.progress} size="1rem" />
                </Box>
              ),
            }
          : {}
      }
    >
      {sortedOptions.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
