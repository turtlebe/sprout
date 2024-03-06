import { datadogRum, RumEvent } from '@datadog/browser-rum';
import { CurrentUser } from '@plentyag/core/src/core-store/types';
import { getFlaskEnvironmentVariable } from '@plentyag/core/src/utils/get-flask-environment-variable';
import ReactGA from 'react-ga';

// prevent re-entry.
let hasStarted = false;

const gaTrackingId = getFlaskEnvironmentVariable('GOOGLE_UA_ID');

function shouldDiscardRumEvent(event: RumEvent) {
  // ignoring, see: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
  const isResizeObserverError =
    event?.type === 'error' && event?.error?.message?.toLowerCase().includes('resizeobserver loop limit exceeded');
  return isResizeObserverError;
}

export function startAnalytics(currentUser?: CurrentUser) {
  if (hasStarted || !currentUser) {
    return;
  }

  hasStarted = true;

  if (gaTrackingId) {
    ReactGA.initialize(gaTrackingId, { gaOptions: { userId: currentUser.userId } });
    ReactGA.set({ dimension1: currentUser.userId });
  }

  const ddAppId = getFlaskEnvironmentVariable('DATA_DOG_APPLICATION_ID');
  const ddClientToken = getFlaskEnvironmentVariable('DATA_DOG_CLIENT_TOKEN');
  if (ddAppId && ddClientToken) {
    // Enable datadog RUM
    datadogRum.init({
      applicationId: ddAppId,
      clientToken: ddClientToken,
      site: 'datadoghq.com',
      sampleRate: 100,
      env: getFlaskEnvironmentVariable('ENVIRONMENT_CONTEXT') || '',
      trackInteractions: true,
      beforeSend: event => {
        if (shouldDiscardRumEvent(event)) {
          return false;
        }
      },
    });
    datadogRum.addRumGlobalContext('usr', {
      id: currentUser.username,
    });
    datadogRum.startSessionReplayRecording();
  }
}

function hasGaStarted() {
  return hasStarted && gaTrackingId;
}

export function trackXhrEvent(method: string, url: string) {
  if (hasGaStarted()) {
    ReactGA.event({
      category: `XHR-${method}`,
      action: url,
    });
  }
}

export function trackPageView(pathname: string) {
  if (hasGaStarted()) {
    ReactGA.set({ page: pathname });
    ReactGA.pageview(pathname);
  }
}
