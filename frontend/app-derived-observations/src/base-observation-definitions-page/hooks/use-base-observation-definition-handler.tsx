import { PATHS } from '@plentyag/app-derived-observations/src/paths';
import { LinkSuccess as Link, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { BaseObservationDefinition } from '@plentyag/core/src/types/derived-observations';

export interface UseBaseObservationDefinitionHandlerReturn {
  handleCreated: (response: BaseObservationDefinition) => void;
  handleUpdated: (response: BaseObservationDefinition) => void;
}

export const useBaseObservationDefinitionHandler = (): UseBaseObservationDefinitionHandlerReturn => {
  const snackbar = useGlobalSnackbar();

  const getLink = (response: BaseObservationDefinition, isCreated?: boolean) => (
    <>
      <Link to={PATHS.baseObservationDefinitionPage(response.id)} onClick={snackbar.closeSnackbar}>
        Base Observation Definition
      </Link>{' '}
      successfully {isCreated ? 'created' : 'updated'}.
    </>
  );

  const handleCreated: UseBaseObservationDefinitionHandlerReturn['handleCreated'] = response => {
    snackbar.successSnackbar(getLink(response, true));
  };

  const handleUpdated: UseBaseObservationDefinitionHandlerReturn['handleUpdated'] = response => {
    snackbar.successSnackbar(getLink(response, false));
  };

  return {
    handleCreated,
    handleUpdated,
  };
};
