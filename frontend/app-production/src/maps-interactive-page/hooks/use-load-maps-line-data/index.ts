import { useGetFarmDefObjectByPath } from '@plentyag/app-production/src/common/hooks';
import { isFarmDefLine } from '@plentyag/core/src/farm-def/type-guards';
import { FarmDefLine, FarmDefMachine, FarmDefObject } from '@plentyag/core/src/farm-def/types';

import { SupportedMachineClass } from '../../types';

export interface UseLoadMapsLineReturn {
  data: FarmDefObject;
  isLoading: boolean;
  line?: FarmDefLine;
  machines?: FarmDefMachine[];
}

/**
 * Hook to get the data to paint the map
 * - the containerLocations of the machine
 * - the machines of the line data
 * Returns:
 *  - machines: collection machines
 *  - line: data of specified line
 */
export const useLoadMapsLineData = (farmDefPath: string): UseLoadMapsLineReturn => {
  const { data, isValidating: isLoading } = useGetFarmDefObjectByPath(farmDefPath, 1);

  // TODO: call to get the Resource State data.

  let machines = [];
  let line: FarmDefLine;

  if (!isLoading && isFarmDefLine(data)) {
    // Line with filter down to only supported machines
    line = {
      ...data,
      machines: Object.keys(data?.machines).reduce<FarmDefLine['machines']>((agg, machineKey) => {
        const machine = data.machines[machineKey];
        if (SupportedMachineClass[machine.class]) {
          return {
            ...agg,
            [machineKey]: machine,
          };
        }
        return agg;
      }, {}),
    };

    // Collect machines in array
    machines = Object.values(line?.machines);
  }

  return {
    data,
    isLoading,
    line,
    machines,
  };
};
