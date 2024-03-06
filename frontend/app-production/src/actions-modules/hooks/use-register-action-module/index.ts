import { RegisteredActionModule } from '@plentyag/app-production/src/actions-modules/types';
import React from 'react';

export interface UseRegisterActionModuleReturn {
  registerActionModule: (actionModule: RegisteredActionModule) => void;
  registeredActionModules: RegisteredActionModule[];
  saveActionModules: () => Promise<any[]>;
}

export const useRegisterActionModule = (): UseRegisterActionModuleReturn => {
  const [registeredActionModules, setRegisteredActionModules] = React.useState<RegisteredActionModule[]>([]);

  const registerActionModule = React.useCallback(
    (actionModule: RegisteredActionModule) => {
      setRegisteredActionModules(curr => {
        // if action module with given name already exists, replace it
        const existing = curr.filter(am => am.name !== actionModule.name);
        return [...existing, actionModule];
      });
    },
    [setRegisteredActionModules]
  );

  const saveActionModules = React.useCallback(async () => {
    return await Promise.all(registeredActionModules.map(async actionModule => actionModule.handleSubmit()));
  }, [registeredActionModules]);

  return { registerActionModule, registeredActionModules, saveActionModules };
};
