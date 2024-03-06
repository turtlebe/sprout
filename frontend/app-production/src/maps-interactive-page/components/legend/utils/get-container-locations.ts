import { ContainerLocation, FarmDefMachine } from '@plentyag/core/src/farm-def/types';

export const getContainerLocations = (machines?: FarmDefMachine[]): Record<string, ContainerLocation> => {
  if (!machines || machines.length < 1) {
    return {};
  }

  return machines.reduce((agg, machine) => {
    Object.values(machine.containerLocations).forEach(containerLocation => {
      const { ref } = containerLocation;
      agg[ref] = containerLocation;
    });

    return agg;
  }, {});
};
