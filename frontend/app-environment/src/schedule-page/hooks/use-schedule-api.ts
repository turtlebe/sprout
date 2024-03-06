import {
  useFetchAndConvertScheduleWithDefinition,
  UseFetchAndConvertScheduleWithDefinitionReturn,
  useScheduleHandler,
  useUnitConversion,
} from '@plentyag/app-environment/src/common/hooks';
import { convertUnitForSchedule, copySchedule, EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { Schedule } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

export interface UseScheduleApi {
  scheduleId: string;
}

export interface UseScheduleApiReturn {
  /**
   * The current Schedule.
   */
  schedule: Schedule;

  /**
   * The current Schedule.
   */
  scheduleRequest: UseFetchAndConvertScheduleWithDefinitionReturn['scheduleRequest'];

  /**
   * The FDS ScheduleDefinition associated to the Schedule.
   */
  scheduleDefinition: ScheduleDefinition;

  /**
   * Returns true when the schedule fetching or revalidating. Corresponds to `isValidating` with {@link useSwrAxios}.
   */
  isLoading: boolean;

  /**
   * Returns true when the schedule being updated and saved to the backend.
   */
  isUpdating: boolean;

  /**
   * Updates the Schedule on the backend with the current local Schedule.
   */
  persistSchedule: ({ onSuccess }: { onSuccess?: (schedule: Schedule) => void }) => void;

  /**
   * Reload the schedule from the backend.
   */
  revalidateSchedule: () => void;

  /**
   * Resets the Schedule to its initial state when it was first fetched.
   */
  resetSchedule: () => void;

  /**
   * Updates the Schedule locally. The Schedule can still be restored via {@link resetSchedule} or persisted to the backend via {@link persistSchedule}.
   */
  updateSchedule: (newSchedule: Schedule) => void;
}

/**
 * Hook that provides an API to interact with a Schedule for a given ID.
 *
 * It handles unit-conversion, fetching the Schedule and its ScheduleDefinition,
 * modifying the Schedule locally and the ability to revert changes or persist them to the backend.
 */
export const useScheduleApi = ({ scheduleId }: UseScheduleApi): UseScheduleApiReturn => {
  const [coreStore] = useCoreStore();
  const snackbar = useGlobalSnackbar();
  const { handleUpdated } = useScheduleHandler();
  const { convertToDefaultUnit, convertToPreferredUnit } = useUnitConversion();
  const requests = {
    getScheduleAndDefinition: useFetchAndConvertScheduleWithDefinition({ scheduleId }),
    // @todo: fix
    updateSchedule: usePutRequest<Schedule, Schedule>({ url: EVS_URLS.schedules.updateUrl(scheduleId) }),
  };
  const [initialSchedule, setInitialSchedule] = React.useState<Schedule>(undefined);
  const [schedule, setSchedule] = React.useState<Schedule>(undefined);
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const { scheduleDefinition } = requests.getScheduleAndDefinition;

  React.useEffect(() => {
    if (requests.getScheduleAndDefinition.schedule) {
      setInitialSchedule(requests.getScheduleAndDefinition.schedule);
      setSchedule(requests.getScheduleAndDefinition.schedule);
    }
  }, [requests.getScheduleAndDefinition.schedule]);

  const persistSchedule: UseScheduleApiReturn['persistSchedule'] = ({ onSuccess }) => {
    setIsUpdating(true);
    const unsortedSchedule = {
      ...convertUnitForSchedule((value, actionDefinition) =>
        convertToDefaultUnit(value, actionDefinition.measurementType)
      )(schedule, scheduleDefinition),
      updatedBy: coreStore.currentUser.username,
    };
    const data = copySchedule({ schedule: unsortedSchedule });
    requests.updateSchedule.makeRequest({
      data,
      onSuccess: (updatedSchedule, headers) => {
        const convertedSchedule = convertUnitForSchedule((value, actionDefinition) =>
          convertToPreferredUnit(value, actionDefinition.measurementType)
        )(updatedSchedule, scheduleDefinition);
        setInitialSchedule(convertedSchedule);
        setSchedule(convertedSchedule);
        setIsUpdating(false);
        handleUpdated(updatedSchedule, headers);
        onSuccess && onSuccess(convertedSchedule);
      },
      onError: error => {
        setIsUpdating(false);
        snackbar.errorSnackbar({ message: parseErrorMessage(error) });
      },
    });
  };

  const resetSchedule: UseScheduleApiReturn['resetSchedule'] = () => setSchedule(initialSchedule);

  const updateSchedule: UseScheduleApiReturn['updateSchedule'] = newSchedule => setSchedule(newSchedule);

  return {
    isLoading: requests.getScheduleAndDefinition.isLoading,
    isUpdating,
    persistSchedule,
    resetSchedule,
    revalidateSchedule: requests.getScheduleAndDefinition.revalidate,
    schedule,
    scheduleRequest: requests.getScheduleAndDefinition.scheduleRequest,
    scheduleDefinition,
    updateSchedule,
  };
};
