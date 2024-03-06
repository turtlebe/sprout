import { ActionDefinition } from '@plentyag/core/src/farm-def/types';

import { useUnitConversion } from './use-unit-conversion';

export interface UseUnitSymbolReturn {
  getUnitSymbol: (actionDefinition: ActionDefinition) => string;
}

export const useUnitSymbol = (): UseUnitSymbolReturn => {
  const { getPreferredUnit } = useUnitConversion();

  const getUnitSymbol: UseUnitSymbolReturn['getUnitSymbol'] = (actionDefinition: ActionDefinition) => {
    const symbol = getPreferredUnit(actionDefinition.measurementType).symbol;

    return symbol ? `(${symbol})` : null;
  };

  return { getUnitSymbol };
};
