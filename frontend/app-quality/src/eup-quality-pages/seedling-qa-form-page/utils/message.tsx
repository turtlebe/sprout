import { SeedlingQaError } from '@plentyag/app-quality/src/common/types';

export const defectsErrorMessage = defects => {
  return (
    <div>
      <div>
        The following defects exceed the allowed thresholds:
        <b> {defects.join(', ')}</b>
      </div>
      <div style={{ marginTop: '5px' }}>Are you sure you want to submit the form?</div>
    </div>
  );
};

export const emptyTrayError = (
  <div style={{ marginTop: '5px' }}>
    Unable to apply QA Pass or Fail results to this tray because it is empty in farm state.
  </div>
);

export const unexpectedError = passed => {
  return (
    <div style={{ marginTop: '5px' }}>
      There was an unexpected problem while attempting to update this tray with QA results. Please submit the{' '}
      {passed ? 'passed' : 'failed'} action or contact support.
    </div>
  );
};

export function errorMessage(qAActionResponseError: SeedlingQaError, passed: boolean) {
  return qAActionResponseError === SeedlingQaError.EMPTY_TRAY ? emptyTrayError : unexpectedError(passed);
}

export function moveToCompostMessage(
  trayId: string,
  qAActionResponseStatus: boolean,
  qAActionResponseError: SeedlingQaError
) {
  return (
    <div>
      <div>
        Tray ID <b>{trayId}</b> exceeds one or more allowable threshold levels and will be routed to compost.
      </div>
      {!qAActionResponseStatus ? errorMessage(qAActionResponseError, false) : null}
    </div>
  );
}

export function moveToTransplantMessage(
  trayId: string,
  qAActionResponseStatus: boolean,
  qAActionResponseError: SeedlingQaError
) {
  return (
    <div>
      <div>
        Tray ID <b>{trayId}</b> passes the allowable threshold levels and will be routed to transplant.
      </div>
      {!qAActionResponseStatus ? errorMessage(qAActionResponseError, true) : null}
    </div>
  );
}
