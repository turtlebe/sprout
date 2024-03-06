import { useQueryParam } from '@plentyag/core/src/hooks';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { ActionsForm } from './components';

interface ActionFormUrlParams {
  actionPath: string;
}

type ActionsFormPage = RouteComponentProps<ActionFormUrlParams>;

/**
 * Wrap "ActionForm" so usable with react router.
 * @param props
 *  actionPath: farm def path to action.
 *  query parameters:
 *    error: error string to show.
 *    args: remaining query parameters will set action form initial args.
 *
 *    example: sites/SSF2/interfaces/TigrisSite/methods/Trash?error=some_error&serial=xyz
 */
export const ActionsFormPage: React.FC<ActionsFormPage> = props => {
  const queryParams = useQueryParam();
  const { actionPath } = props.match.params;

  let error = '';
  const initialArgs = {};

  queryParams.forEach((value, name) => {
    if (name === 'error') {
      error = value;
    } else {
      initialArgs[name] = { isDisabled: true, value: value };
    }
  });

  const operation: ProdActions.Operation = {
    path: actionPath,
    prefilledArgs: initialArgs,
  };

  return <ActionsForm operation={operation} disableSubmitAfterSuccess={false} error={error} />;
};
