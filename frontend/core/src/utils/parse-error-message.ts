import { get } from 'lodash';

export const DEFAULT_ERROR_MESSSAGE =
  'Sorry, something wrong happened. Please check your network settings and try refreshing your browser. If the problem persists, please contact [#farmos-support](https://plenty-ag.slack.com/archives/C7Y0Q0N9L) on Slack';

function handleErrorWithMessageAndDetails(error) {
  const errorMsg = get(error, 'data.message.error.message', null);
  const detailsMsg = get(error, 'data.message.error.details', null);
  return (
    errorMsg &&
    detailsMsg &&
    `Error: ${errorMsg}

Details: ${detailsMsg}`
  );
}

/**
 * Attempt to find an error message in multiple places
 * @param error
 * @return error message
 */
export const parseErrorMessage = (error: any): string => {
  return [
    error,
    error.response && parseErrorMessage(error.response),
    get(error, 'data.message.error.error', null),
    handleErrorWithMessageAndDetails(error),
    get(error, 'data.message.error', null),
    get(error, 'data.error.message', null),
    get(error, 'data.details', null),
    get(error, 'data.error', null) && typeof get(error, 'data.error') === 'string' && get(error, 'data.error', null),
    error.error && typeof error.error === 'string' && error.error,
    error instanceof Error && error.message,
    error.data && typeof error.data === 'string' && error.data.match(/<html[^>]*>/g) && DEFAULT_ERROR_MESSSAGE, // can't parse raw html so will default to message
    error.data && JSON.stringify(error.data),
    JSON.stringify(error),
  ].find(message => typeof message === 'string');
};
