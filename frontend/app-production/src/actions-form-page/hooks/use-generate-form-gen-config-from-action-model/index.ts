import useCoreStore from '@plentyag/core/src/core-store';
import {
  getExecutiveServiceRequestUrl,
  getExecutiveServiceSubmitterHeaders,
  getExecutiveServiceTellUrl,
} from '@plentyag/core/src/utils';

import { formGenFieldFactory } from '../../utils/form-gen-field-factory';

export function useGenerateFormGenConfigFromActionModel({
  action,
  operation,
  serialize,
  deserialize = (value: any) => value,
  createEndpoint,
  updateEndpoint,
}: {
  action: ProdActions.ActionModel;
  operation: ProdActions.Operation;
  serialize?: (value: any) => any;
  deserialize?: (value: any) => any;
  createEndpoint?: string;
  updateEndpoint?: string;
}) {
  const state = useCoreStore()[0];

  function defaultSerialize(values: Object) {
    return {
      ...values,
      ...getExecutiveServiceSubmitterHeaders(state),
    };
  }

  const formGenFields = action.fields
    .reduce<FormGen.FieldAny[]>((prev, curr) => {
      return prev.concat(
        formGenFieldFactory({ field: curr, operation, currentFarmPath: state?.currentUser?.currentFarmDefPath })
      );
    }, [])
    .filter(item => item);

  const actionTypeSubtitle = action.actionType ? `(${action.actionType}) ` : '';

  const actionPath = operation.path;
  const _createEndpoint =
    createEndpoint ||
    (action.actionType === 'request'
      ? getExecutiveServiceRequestUrl(actionPath)
      : getExecutiveServiceTellUrl(actionPath));

  const formGenConfig: FormGen.Config = {
    title: action.name,
    subtitle: `${actionTypeSubtitle}${action.description}`,
    fields: formGenFields,
    createEndpoint: _createEndpoint,
    updateEndpoint,
    serialize: serialize || defaultSerialize,
    deserialize,
  };

  return formGenConfig;
}
