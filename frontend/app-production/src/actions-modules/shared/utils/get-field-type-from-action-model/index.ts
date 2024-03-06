import { FieldType } from '@plentyag/app-production/src/actions-modules/types';

export const getFieldTypeFromActionModel = (actionModel: ProdActions.ActionModel, fieldName: string): FieldType =>
  actionModel?.fields?.find(field => field.name === fieldName)?.type;
