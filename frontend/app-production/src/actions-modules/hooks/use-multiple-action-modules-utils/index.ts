import { useMemo } from 'react';

import { ActionModuleProps } from '../../types';

/**
 * Multiple action modules data
 * @param errorList list of all the formik errors of all the modules
 * @param isDirty check if any of the modules have changes
 * @param submitCount total amount of attempted submissions of all the modules
 * @param submitAttempted check if any of modules had attempted submission
 */
export interface UseMultipleActionModulesUtilsReturn {
  errorList: string[];
  isDirty: boolean;
  submitCount: number;
  submitAttempted: boolean;
}

/**
 * For pages that are using multiple Action Modules, this utility hook help provides
 * formik's state across the different Action Modules including
 *  - the validation errors of all the modules
 *  - the sum of all the submission attempts of all the modules
 *  - checking if any of the modules have changed (isDirty)
 * @param {ActionModuleProps[]} actionModuleProps
 * @returns {UseMultipleActionModulesUtilsReturn}
 */
export const useMultipleActionModulesUtils = (
  actionModuleProps: ActionModuleProps[]
): UseMultipleActionModulesUtilsReturn => {
  const errorList = useMemo(
    () =>
      actionModuleProps.reduce((acc, prop) => {
        if (prop?.formik.errors && Object.keys(prop.formik.errors).length) {
          return [...acc, ...Object.values(prop.formik.errors)];
        }
        return acc;
      }, []) || [],
    [actionModuleProps]
  );

  const submitCount = useMemo(
    () => actionModuleProps.reduce((acc, prop) => prop?.formik.submitCount + acc, 0),
    [actionModuleProps]
  );

  const submitAttempted = useMemo(() => submitCount > 0, [submitCount]);

  const isDirty = useMemo(() => actionModuleProps.some(prop => prop?.formik.dirty), [actionModuleProps]);

  return {
    errorList,
    submitCount,
    submitAttempted,
    isDirty,
  };
};
