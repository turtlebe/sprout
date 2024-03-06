import { PATHS } from '@plentyag/app-environment/src/paths';
import { LinkSuccess as Link, useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { Metric } from '@plentyag/core/src/types/environment';
import { parseErrorMessage } from '@plentyag/core/src/utils';

export const dataTestIdLinkToMetricPage = 'dataTestIdLinkToMetricPage';

export interface UseMetricErrorHandlerReturn {
  handleError: (error: any) => void;
  handleCreated: (response: Metric) => void;
  handleUpdated: (response: Metric) => void;
}

export const useMetricErrorHandler = (): UseMetricErrorHandlerReturn => {
  const snackbar = useGlobalSnackbar();

  const handleError: UseMetricErrorHandlerReturn['handleError'] = error => {
    const message = parseErrorMessage(error);
    if (message.includes('This Metric already exists.')) {
      const [, metricId] = message.split('#');
      snackbar.errorSnackbar({
        message: (
          <>
            Another Metric with the same Path, Measurement Type and Observation Name already exists.&nbsp;
            <Link data-testid={dataTestIdLinkToMetricPage} to={PATHS.metricPage(metricId)}>
              See this Metric.
            </Link>
          </>
        ),
      });
    } else if (error.status < 500 && message) {
      snackbar.errorSnackbar({ message });
    } else {
      snackbar.errorSnackbar();
      console.error(error);
    }
  };

  const getLink = (response: Metric, isCreated?: boolean) => (
    <>
      <Link to={PATHS.metricPage(response.id)} onClick={snackbar.closeSnackbar}>
        Metric
      </Link>{' '}
      successfully {isCreated ? 'created' : 'updated'}.
    </>
  );

  const handleCreated: UseMetricErrorHandlerReturn['handleCreated'] = response => {
    snackbar.successSnackbar(getLink(response, true));
  };

  const handleUpdated: UseMetricErrorHandlerReturn['handleUpdated'] = response => {
    snackbar.successSnackbar(getLink(response, false));
  };

  return {
    handleError,
    handleCreated,
    handleUpdated,
  };
};
