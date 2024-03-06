import { forEach, groupBy, keys, sortBy } from 'lodash';
import React from 'react';

import { FarmOsModules } from '../../../config/farmos-modules';

export const useMemoFarmOsModules = (farmOsModuleNames: string[] = []) => {
  const allowedFarmOsModules = React.useMemo(
    () => FarmOsModules.filter(farmOsModule => farmOsModuleNames.includes(farmOsModule.resource)),
    [FarmOsModules, farmOsModuleNames]
  );
  const sortedFarmOsModules = React.useMemo(
    () => sortBy(allowedFarmOsModules, farmOsModule => farmOsModule.label.toLowerCase()),
    [allowedFarmOsModules]
  );
  const groupedFarmOsModules = React.useMemo(
    () => groupBy(allowedFarmOsModules, farmOsModule => farmOsModule.groupUnder || farmOsModule.label),
    [allowedFarmOsModules]
  );
  React.useMemo(
    () =>
      forEach(groupedFarmOsModules, (value, key) => {
        groupedFarmOsModules[key] = sortBy(value, value => value.label.toLowerCase());
      }),
    [groupedFarmOsModules]
  );
  const sortedFarmOsModuleKeys = React.useMemo(
    () => sortBy(keys(groupedFarmOsModules), key => key.toLowerCase()),
    [groupedFarmOsModules]
  );

  return {
    allowedFarmOsModules,
    groupedFarmOsModules,
    sortedFarmOsModules,
    sortedFarmOsModuleKeys,
  };
};
