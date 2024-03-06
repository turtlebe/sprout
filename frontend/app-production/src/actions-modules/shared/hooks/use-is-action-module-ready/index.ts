import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { useEffect, useState } from 'react';

interface UseIsActionModuleReady extends ActionModuleProps {
  field: string;
}

export const useIsActionModuleReady = ({ field, formik, actionModel }: UseIsActionModuleReady): boolean => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady && formik?.values && Object.keys(formik.values).length > 0 && actionModel) {
      if (!(field in formik.values)) {
        console.error(`Field "${field}" is not found in this Action "${actionModel.name}"`, actionModel);
      } else {
        setIsReady(true);
      }
    }
  }, [isReady, formik?.values, field, actionModel]);

  return isReady;
};
