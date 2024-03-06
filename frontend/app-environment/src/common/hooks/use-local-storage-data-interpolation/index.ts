import { DEFAULT_DATA_INTERPOLATION } from '@plentyag/app-environment/src/common/utils/constants';
import { DataInterpolation } from '@plentyag/core/src/types/environment';
import { Dispatch, SetStateAction } from 'react';
import { useLocalStorage } from 'react-use';

export const LOCAL_STORAGE_KEY_DATA_INTERPOLATION = 'environment-v2-data-interpolation-preference';

export interface UseLocalStorageDataInterpolation {
  id: string;
}

export type UseLocalStorageDataInterpolationReturn = [DataInterpolation, Dispatch<SetStateAction<DataInterpolation>>];

export const useLocalStorageDataInterpolation = ({
  id,
}: UseLocalStorageDataInterpolation): UseLocalStorageDataInterpolationReturn => {
  const [dataInterpolation, setDataInterpolation] = useLocalStorage<DataInterpolation>(
    `${LOCAL_STORAGE_KEY_DATA_INTERPOLATION}-${id}`,
    DEFAULT_DATA_INTERPOLATION
  );

  return [dataInterpolation, setDataInterpolation];
};
