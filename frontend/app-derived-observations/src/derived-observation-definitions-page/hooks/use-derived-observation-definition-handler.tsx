import { PATHS } from '@plentyag/app-derived-observations/src/paths';
import { LinkSuccess as Link, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { DerivedObservationDefinition } from '@plentyag/core/src/types/derived-observations';

export interface UseDerivedObservationDefinitionHandlerReturn {
  handleCreated: (response: DerivedObservationDefinition) => void;
  handleUpdated: (response: DerivedObservationDefinition) => void;
}

export const useDerivedObservationDefinitionHandler = (): UseDerivedObservationDefinitionHandlerReturn => {
  const snackbar = useGlobalSnackbar();

  const getLink = (response: DerivedObservationDefinition, isCreated?: boolean) => (
    <>
      <Link to={PATHS.derivedObservationDefinitionPage(response.id)} onClick={snackbar.closeSnackbar}>
        Derived Observation Definition
      </Link>{' '}
      successfully {isCreated ? 'created' : 'updated'}.
    </>
  );

  const handleCreated: UseDerivedObservationDefinitionHandlerReturn['handleCreated'] = response => {
    snackbar.successSnackbar(getLink(response, true));
  };

  const handleUpdated: UseDerivedObservationDefinitionHandlerReturn['handleUpdated'] = response => {
    snackbar.successSnackbar(getLink(response, false));
  };

  return {
    handleCreated,
    handleUpdated,
  };
};
