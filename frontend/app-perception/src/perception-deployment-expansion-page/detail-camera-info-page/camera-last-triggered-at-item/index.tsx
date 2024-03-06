import { CircularProgress } from '@plentyag/brand-ui/src/material-ui/core';
import { useGetObservations } from '@plentyag/core/src/hooks';

const dataTestIds = {
  isValidating: 'camera-last-triggered-at-item-is-validating',
  validResult: 'camera-last-triggered-at-item-valid-result',
};

export { dataTestIds as dataTestIdCameraLastTriggeredAtItem };

export const CameraLastTriggeredAtItem: React.FC<{ locationPath: string }> = ({ locationPath }) => {
  const { data, isValidating } = useGetObservations({
    observationName: 'CameraTriggeredAtTime',
    path: locationPath,
    amount: -30,
    unit: 'day',
    limit: 1,
  });

  if (isValidating) {
    return <CircularProgress data-testid={dataTestIds.isValidating} />;
  }
  if (data && !isValidating) {
    return (
      <div data-testid={dataTestIds.validResult}>
        {data.data.length > 0 && data.data[0].rawObservation.datum.observedDatum.datumValue.stringValue}
      </div>
    );
  }

  if (!data && !isValidating) {
    return null;
  }
};
