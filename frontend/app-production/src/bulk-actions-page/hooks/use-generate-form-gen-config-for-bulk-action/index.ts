import {
  useGenerateFormGenConfigFromActionModel,
  useGetActionModel,
} from '@plentyag/app-production/src/actions-form-page/hooks';
import { titleCase } from 'voca';

export function useGenerateFormGenConfigForBulkAction(operation: ProdActions.Operation) {
  const { action } = useGetActionModel(operation);

  const bulkOperationFieldName = operation.bulkFieldName;

  const bulkOperationField = action?.fields?.filter(field => field.name === bulkOperationFieldName);
  if (bulkOperationField?.length === 1) {
    const serialField = bulkOperationField[0];
    // puralize the field name so ui shows appropriate name for bulk operation.
    serialField.displayName = `${titleCase(bulkOperationFieldName)}(s)`;
  }

  return useGenerateFormGenConfigFromActionModel({ action, operation });
}
