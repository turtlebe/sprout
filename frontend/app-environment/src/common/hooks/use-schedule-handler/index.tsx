import { PATHS } from '@plentyag/app-environment/src/paths';
import { LinkSuccess as Link, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Schedule } from '@plentyag/core/src/types/environment';

interface GetLink {
  schedule: Schedule;
  isCreated: boolean;
  isSyncedWithEs: boolean;
}

export interface UseScheduleHandlerReturn {
  handleCreated: (response: Schedule, headers: any) => void;
  handleUpdated: (response: Schedule, headers: any) => void;
}

/**
 * Update/Create success handler for Schedules.
 *
 * When we update/create a schedule through EnvironmentService, the response contains a header `X-Is-Synced-With-Es`.
 *
 * We look for that header to notify the user if the Schedule has been updated successfully in EVS and synced in ES, or if it hasn't been synced with ES.
 */
export const useScheduleHandler = (): UseScheduleHandlerReturn => {
  const snackbar = useGlobalSnackbar();

  const getLink = ({ schedule, isCreated, isSyncedWithEs }: GetLink) => (
    <>
      <Link to={PATHS.schedulePage(schedule.id)} onClick={snackbar.closeSnackbar}>
        Schedule
      </Link>{' '}
      successfully {isCreated ? 'created' : 'updated'}.{' '}
      {isSyncedWithEs && <>However, it was not synced with ExecutiveService.</>}
    </>
  );

  const isSynced = headers => headers['x-is-synced-with-es'] === 'false';

  const handleCreated: UseScheduleHandlerReturn['handleCreated'] = (schedule, headers) => {
    const isSyncedWithEs = isSynced(headers);
    const snackbarFn = isSyncedWithEs ? snackbar.warningSnackbar : snackbar.successSnackbar;
    snackbarFn(getLink({ schedule, isCreated: true, isSyncedWithEs }));
  };

  const handleUpdated: UseScheduleHandlerReturn['handleUpdated'] = (schedule, headers) => {
    const isSyncedWithEs = isSynced(headers);
    const snackbarFn = isSyncedWithEs ? snackbar.warningSnackbar : snackbar.successSnackbar;
    snackbarFn(getLink({ schedule, isCreated: false, isSyncedWithEs }));
  };

  return {
    handleCreated,
    handleUpdated,
  };
};
